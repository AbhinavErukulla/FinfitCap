function success(res, data = null, message = 'OK', status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

function error(res, message = 'Error', status = 400, code = 'ERROR', details = null) {
  const body = {
    success: false,
    message,
    code,
  };
  if (details != null) body.details = details;
  return res.status(status).json(body);
}

module.exports = { success, error };
