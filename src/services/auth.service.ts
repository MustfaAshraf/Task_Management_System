import User, { IUser } from '../models/user.model';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt';
import { createConflictError, createUnauthorizedError, createNotFoundError } from '../utils/api.errors';


export const register = async (userData: Partial<IUser>) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw createConflictError('Email is already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password as string, salt);

    const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'Member'
    });

    const accessToken = generateAccessToken({ id: newUser._id, role: newUser.role });
    const refreshToken = generateRefreshToken({ id: newUser._id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    newUser.refreshTokens.push({ token: refreshToken, expiresAt });
    await newUser.save();

    const { password: _, refreshTokens: __, ...userResponse } = newUser.toObject();

    return {
        user: userResponse,
        accessToken
    };
};

export const login = async (credentials: Partial<IUser>) => {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
        throw createUnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(credentials.password as string, user.password);
    if (!isMatch) {
        throw createUnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    user.refreshTokens = user.refreshTokens.filter(rt => rt.expiresAt > new Date());

    user.refreshTokens.push({ token: refreshToken, expiresAt });
    await user.save();

    const { password: _, refreshTokens: __, ...userResponse } = user.toObject();

    return {
        user: userResponse,
        accessToken
    };
};

export const refreshAuthTokens = async (incomingRefreshToken: string) => {
    if (!incomingRefreshToken) {
        throw new Error('Refresh token is required');
    }

    const decoded: any = verifyToken(incomingRefreshToken, true);

    const user = await User.findById(decoded.id);
    if (!user) {
        throw createNotFoundError('User not found');
    }

    const tokenExists = user.refreshTokens.find(rt => rt.token === incomingRefreshToken);
    if (!tokenExists) {
        throw createUnauthorizedError('Invalid refresh token or session expired');
    }

    const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
    const newRefreshToken = generateRefreshToken({ id: user._id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== incomingRefreshToken);
    user.refreshTokens.push({ token: newRefreshToken, expiresAt });

    await user.save();

    return {
        accessToken: newAccessToken,
    };
};