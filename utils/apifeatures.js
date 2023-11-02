// Define a class named 'ApiFeatures'.
class ApiFeatures {
    // Constructor that takes two parameters: 'query' and 'queryStr'.
    constructor(query, queryStr) {
        this.query = query; // Initialize 'query' with the Mongoose query object.
        this.queryStr = queryStr; // Initialize 'queryStr' with the query string.
    }

    // Method to perform a text search based on the 'keyword' in the query string.
    search() {
        // Check if 'keyword' exists in 'queryStr', if not, set an empty object.
        const keyword = this.queryStr.keyword
            ? {
                // Create a regex search on the 'name' field with case-insensitive option.
                name: {
                    $regex: this.queryStr.keyword,
                    $options: "i", // 'i' for case-insensitive search.
                },
            }
            : {};

        // console.log(keyword)
        // Update the 'query' to include the search criteria.
        this.query = this.query.find({ ...keyword });

        // Return the current instance of 'ApiFeatures' to allow method chaining.
        return this;
    }

    // Method to filter the query based on various criteria in the query string.
    filter() {
        // Create a copy of 'queryStr' to modify without affecting the original.
        const queryCopy = { ...this.queryStr };

        // Define an array of fields to remove from the 'queryCopy'.
        const removeFields = ["keyword", "page", "limit"];

        // Remove unwanted fields from the 'queryCopy'.
        removeFields.forEach((key) => delete queryCopy[key]);

        // Convert 'queryCopy' into a JSON string.
        let queryStr = JSON.stringify(queryCopy);

        // Replace specific keywords (gt, gte, lt, lte) with MongoDB operators.
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // Update the 'query' to include the filtered criteria.
        this.query = this.query.find(JSON.parse(queryStr));

        // Return the current instance of 'ApiFeatures' for method chaining.
        return this;
    }

    // Method to implement pagination for query results.
    pagination(resultPerPage) {
        // Get the current page from 'queryStr', default to 1 if not provided.
        const currentPage = Number(this.queryStr.page) || 1;

        // Calculate the number of documents to skip based on the current page.
        const skip = resultPerPage * (currentPage - 1);

        // Update the 'query' to limit the results and skip the calculated number.
        this.query = this.query.limit(resultPerPage).skip(skip);

        // Return the current instance of 'ApiFeatures' for method chaining.
        return this;
    }
}

// Export the 'ApiFeatures' class to make it available in other parts of the application.
module.exports = ApiFeatures;
