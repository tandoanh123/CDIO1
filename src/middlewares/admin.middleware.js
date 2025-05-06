/**
 * Middleware functions for authentication and authorization.
 * @module adminMiddleware
 */

/**
 * Checks if the admin is logged in by checking if the session has an admin property.
 * @function isLoggedInAdmin
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.isLoggedInAdmin = (req, res, next) => {
  console.log(`isLoggedInAdmin: ${JSON.stringify(req.session.admin)}`);
  if (req.session.admin) {
    next();
  } else {
    res.status(401).redirect("/admin/login");
  }
};

/**
 * Checks if the admin is authenticated by checking if the session has an admin property.
 * If the admin is authenticated, redirects to the dashboard.
 * @function checkAuthAdmin
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.checkAuthAdmin = (req, res, next) => {
  console.log(`checkAuthAdmin: ${JSON.stringify(req.session.admin)}`);
  if (req.session.admin) {
    res.redirect("/admin/dashboard"); // Chuyển hướng trực tiếp đến dashboard
  } else {
    next();
  }
};

/**
 * Checks if the admin is unauthenticated by checking if the session has no admin property.
 * If the admin is unauthenticated, redirects to the login page.
 * @function checkUnauthAdmin
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
exports.checkUnauthAdmin = (req, res, next) => {
  console.log(`checkUnauthAdmin: ${JSON.stringify(req.session.admin)}`);
  if (!req.session.admin) {
    res.status(401).redirect("/admin/login");
  } else {
    next();
  }
};
