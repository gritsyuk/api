class ApiFeatures {
    constructor(query, queryObject) {
        this.query = query;
        this.queryObject = queryObject; 
    }
    find() {
        const queryObj = {...this.queryObject};
        const exclude = ['page', 'limit', 'sort', 'fields'];

        exclude.forEach((item) => delete queryObj[item]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryString));
        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }
    sort() {
        if (this.queryObject.sort) {
            const sortBy = this.queryObject.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-create_date');
        }
        return this;
    }
    select() {
        if (this.queryObject.fields) {
            const fields = this.queryObject.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }
    pagination() {
        let limit = this.queryObject.limit * 1 || 5;
        let page = this.queryObject.page * 1 || 1;
        let skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        // if (this.queryObject.page) {
        //     let countQuery = await this.query.countDocuments();
        //     let maxPage =  Math.ceil(countQuery / limit);
        //     if (page > maxPage) throw new Error('Page size maximum');
        // }
        return this;
    }

}

module.exports = ApiFeatures;