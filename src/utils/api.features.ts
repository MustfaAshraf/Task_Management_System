import { Query } from 'mongoose';

export class ApiFeatures {
    public mongooseQuery: Query<any, any>;
    public queryString: any;

    constructor(mongooseQuery: Query<any, any>, queryString: any) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach(el => delete queryObj[el]);

        this.mongooseQuery = this.mongooseQuery.find(queryObj);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = (this.queryString.sort as string).split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    paginate() {
        const page = parseInt(this.queryString.page as string, 10) || 1;
        const limit = parseInt(this.queryString.limit as string, 10) || 10;
        const skip = (page - 1) * limit;

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        return this;
    }
}