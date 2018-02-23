package com.rest.resources;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.core.beans.Coupon;
import com.core.beans.CouponType;
import com.core.beans.Customer;
import com.core.exceptions.CouponSystemException;
import com.core.facades.ClientFacade;
import com.core.facades.CustomerFacade;

@Path("/customer")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CustomerService {

	public CustomerService() {
	}

	/**
	 * a method for customer to buy coupon lower the amount of the parameter
	 * coupon in DB by 1 and updates the DB tables
	 */
	@PUT
	@Path("/coupon")
	public void purchaseCoupon(@Context HttpServletRequest request, Coupon coupon) throws CouponSystemException {
		CustomerFacade customerFacade = getFacadeFromSession(request);
		customerFacade.purchaseCoupon(coupon);
	}

	/**
	 * returns an array of Coupons purchased by the customer from the DB
	 */
	@GET
	@Path("/coupon")
	public Coupon[] getPurchasedCoupons(@Context HttpServletRequest request) throws CouponSystemException {
		return getFacadeFromSession(request).getPurchasedCoupons().toArray(new Coupon[0]);
	}

	/**
	 * returns an array of Coupons of type like the parameter, purchased by the
	 * customer from the DB
	 */
	@GET
	@Path("/coupon/type/{type}")
	public Coupon[] getPurchasedCouponsByType(@Context HttpServletRequest request, @PathParam("type") String type)
			throws CouponSystemException {
		return getFacadeFromSession(request).getPurchasedCouponsByType(CouponType.valueOf(type)).toArray(new Coupon[0]);
	}

	/**
	 * returns an array of Coupons with price lower than parameter, purchased by
	 * the customer from the DB
	 */
	@GET
	@Path("/coupon/price/{price}")
	public Coupon[] getPurchasedCouponsByPrice(@Context HttpServletRequest request, @PathParam("price") double price)
			throws CouponSystemException {
		return getFacadeFromSession(request).getPurchasedCouponsByPrice(price).toArray(new Coupon[0]);
	}

	/**
	 * returns an array of Coupons from the DB
	 */
	@GET
	@Path("/systemCoupons")
	public Coupon[] getSystemCoupons(@Context HttpServletRequest request) throws CouponSystemException {
		return getFacadeFromSession(request).getSystemCoupons().toArray(new Coupon[0]);
	}

	/**
	 * returns a Customer object holding information of current logged in
	 * customer user
	 */
	@GET
	public Customer returnCurrentCustomer(@Context HttpServletRequest request) throws CouponSystemException {
		return getFacadeFromSession(request).returnCurrentCustomer();
	}

	/**
	 * returns the facade attribute object from the session
	 * 
	 * @throws CouponSystemException
	 *             - if the facade object is not an instance of CustomerFacade
	 */
	private CustomerFacade getFacadeFromSession(HttpServletRequest request) throws CouponSystemException {
		HttpSession session = request.getSession(false);
		ClientFacade facade = (ClientFacade) session.getAttribute("facade");
		if (!(facade instanceof CustomerFacade)) {
			throw new CouponSystemException("unsupported user action");
		}
		return (CustomerFacade) facade;
	}

}
