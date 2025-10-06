class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  Filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];

    excludesFields.forEach((field) => {
      delete queryStringObj[field];
    });

    let queryString = JSON.stringify(queryStringObj);

    queryString = queryString.replace(
      /\b(gte)|(gt)|(lt)|(lte)\b/g,
      (match) => `$${match}`
    );

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));

    return this;
  }

  Search(modelName) {
    if (this.queryString.keyword) {
      const query = {};
      if (modelName == "UserModel") {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
          { room: { $regex: this.queryString.keyword, $options: "i" } },
          { safar: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  Sort() {
    if (this.queryString.sort) {
      let sortString = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortString);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  LimitFields() {
    if (this.queryString.fields) {
      let fieldsString = this.queryString.fields.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.select(fieldsString);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  Paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 2000;

    const skip = (page - 1) * limit;

    const endIndexInPage = page * limit;

    let pagination = {};

    pagination.currentPage = page;

    pagination.limit = limit;

    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    // nextPage
    if (endIndexInPage < countDocuments) {
      pagination.next = page + 1;
    }

    // prevPage

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.pagination = pagination;

    return this;
  }
}

module.exports = ApiFeatures;
