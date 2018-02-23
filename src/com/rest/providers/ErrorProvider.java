package com.rest.providers;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import com.core.exceptions.CouponSystemException;
import com.rest.beans.ErrorMessage;

@Provider
public class ErrorProvider implements ExceptionMapper<CouponSystemException> {

	@Override
	public Response toResponse(CouponSystemException exception) {
		return Response.serverError().entity(new ErrorMessage(exception.getMessage())).build();
	}

}
