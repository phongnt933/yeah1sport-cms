enum END_POINT {
  GET_CURRENT_USER = "/users/:id",
  GET_LIST_USER = "/users",
  GET_LIST_FIELD = "/fields",
  GET_LIST_BOOKING = "/bookings",

  DELETE_FIELD = "/admin/field/:fieldId",
  TEAM = "/admin/team",
}

export default END_POINT;
