package com.rest.providers;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import com.rest.beans.ErrorMessage;


@Provider
public class IllegalArgumentProvider implements ExceptionMapper<IllegalArgumentException>{

	@Override
	public Response toResponse(IllegalArgumentException exception) {
		return Response.serverError().entity(new ErrorMessage("bad input")).build();
	}

}
