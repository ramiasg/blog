const { queryString } = require("./queryString");

module.exports.paginatedResults = async (req, model, where, $in) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const itemsCount = where
    ? await model.countDocuments(queryString(req)).where(where).in($in).exec()
    : await model.countDocuments(queryString(req)).exec();
  const pagination = {
    totalCount: itemsCount,
    totalPages: Math.ceil(itemsCount / limit),
    limit: limit,
  };
  if (startIndex > 0) {
    pagination.previous = page - 1;
  }
  pagination.current = page ? page : 1;
  if (endIndex < itemsCount) {
    pagination.next = page + 1;
  }
  return {
    pagination,
    startIndex,
  };
};
