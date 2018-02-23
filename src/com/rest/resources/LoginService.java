package com.rest.resources;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.core.exceptions.CouponSystemException;
import com.core.facades.AdminFacade;
import com.core.facades.CompanyFacade;
import com.core.facades.CustomerFacade;
import com.core.facades.clientType;
import com.core.system.CouponSystem;
import com.rest.dataobjects.LoginParameters;

@Path("/login")
@Produces({MediaType.APPLICATION_JSON})
@Consumes(MediaType.APPLICATION_JSON)
public class LoginService {

	@POST
	public void login(@Context HttpServletRequest request, LoginParameters loginStrings)
			throws CouponSystemException, Exception {
		HttpSession session = request.getSession(false);
		if (session != null) {
			if (session.getAttribute("facade") == null) { 
				session.setAttribute(
						"facade",
						CouponSystem.getInstance().login(
								loginStrings.getUserName(),
								loginStrings.getPassword(),
								clientType.valueOf(loginStrings.getUserType())));
			}
		} else {
			request.getSession(true).setAttribute(
					"facade",
					CouponSystem.getInstance().login(
							loginStrings.getUserName(),
							loginStrings.getPassword(),
							clientType.valueOf(loginStrings.getUserType())));			
		}
	}

	@DELETE
	public void logOut(@Context HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute("fasade");
			session.invalidate();
		}
	}
	
	@GET
	@Path("/userDetails")
	public LoginParameters getUserDetails(@Context HttpServletRequest request) throws CouponSystemException{
		LoginParameters loginParameters=new LoginParameters();
		loginParameters.setUserType("GUEST");
		HttpSession session=request.getSession(false);
		if(session!=null){
			Object clientFacade=session.getAttribute("facade");
			if(clientFacade !=null){
				if(clientFacade instanceof CustomerFacade){
					loginParameters.setUserType("CUSTOMER");
					CustomerFacade customerFacade=(CustomerFacade)clientFacade;
					loginParameters.setUserName(customerFacade.returnCurrentCustomer().getCustomerName());
				}else if(clientFacade instanceof CompanyFacade){
					loginParameters.setUserType("COMPANY");
					CompanyFacade companyFacade=(CompanyFacade)clientFacade;
					loginParameters.setUserName(companyFacade.returnCurrentCompany().getCompanyName());
				}else if (clientFacade instanceof AdminFacade){
					loginParameters.setUserType("ADMIN");
					loginParameters.setUserName("admin");
				}
			}
		}
		
		return loginParameters;
	}
	
}
