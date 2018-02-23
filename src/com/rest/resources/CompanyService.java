package com.rest.resources;

import java.sql.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.core.beans.Company;
import com.core.beans.Coupon;
import com.core.beans.CouponType;
import com.core.exceptions.CouponSystemException;
import com.core.facades.ClientFacade;
import com.core.facades.CompanyFacade;

@Path("/company")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CompanyService {

	public CompanyService() {
	}

	/**
	 * sends a Coupon object to insert to the DB as a new Coupon returns a
	 * Coupon object after updating it with new created Coupon ID on DB
	 * 
	 * @return
	 */
	@POST
	@Path("/coupon")
	public Coupon createCoupon(@Context HttpServletRequest request, Coupon coupon) throws CouponSystemException {
		checkValidCoupon(coupon);
		coupon.setId(getFacadeFromSession(request).createCoupon(coupon));
		return coupon;
	}

	/**
	 * returns a Coupon from DB with ID equals to the method parameter
	 */
	@GET
	@Path("/coupon/{id}")
	public Coupon readCoupon(@Context HttpServletRequest request, @PathParam("id") long id)
			throws CouponSystemException {
		return getFacadeFromSession(request).readCoupon(id);
	}

	/**
	 * updates a Coupon on DB and returns an updated Coupon read from the DB
	 * 
	 * @return
	 */
	@PUT
	@Path("/coupon")
	public Coupon updateCoupon(@Context HttpServletRequest request, Coupon coupon) throws CouponSystemException {
		checkValidCoupon(coupon);
		CompanyFacade companyFacade = getFacadeFromSession(request);
		Coupon currentDBCoupon = companyFacade.readCoupon(coupon.getId());
		// checks if end date and/or price are different before sending an
		// update to DB
		if (!(currentDBCoupon.getEndDate().equals(coupon.getEndDate())
				&& currentDBCoupon.getPrice() == coupon.getPrice())) {
			companyFacade.updateCoupon(coupon);
		}
		currentDBCoupon = companyFacade.readCoupon(coupon.getId());
		return currentDBCoupon;
	}

	/**
	 * deletes a Coupon from the DB and returns a Coupon object representing the
	 * deleted Coupon
	 * 
	 * @return
	 */
	@DELETE
	@Path("/coupon/{id}")
	public Coupon deleteCoupon(@Context HttpServletRequest request, @PathParam("id") long id)
			throws CouponSystemException {
		CompanyFacade companyFacade = getFacadeFromSession(request);
		// retrieve the coupon from DB to pass a coupon object with ID and title
		// for restrictions tests in facade methods
		Coupon coupon = companyFacade.readCoupon(id);
		companyFacade.deleteCoupon(coupon);
		return coupon;
	}

	/**
	 * returns an array of Coupons from the DB
	 */
	@GET
	@Path("/coupon")
	public Coupon[] getAllCoupons(@Context HttpServletRequest request) throws CouponSystemException {
		return getFacadeFromSession(request).getAllCoupons().toArray(new Coupon[0]);
	}

	/**
	 * returns an array of Coupons of type matching the method parameter from
	 * the DB
	 */
	@GET
	@Path("/coupon/type/{type}")
	public Coupon[] getCouponsByType(@Context HttpServletRequest request, @PathParam("type") String type)
			throws CouponSystemException {
		return getFacadeFromSession(request).getCouponsByType(CouponType.valueOf(type)).toArray(new Coupon[0]);
	}

	/**
	 * returns an array of Coupons with price lower than price parameter from
	 * the DB
	 */
	@GET
	@Path("/coupon/price/{price}")
	public Coupon[] getCouponsByTopPrice(@Context HttpServletRequest request, @PathParam("price") double price)
			throws CouponSystemException {
		return getFacadeFromSession(request).getCouponsByTopPrice(price).toArray(new Coupon[0]);
	}

	/**
	 * returns an array of Coupons expiring sooner than the date in the
	 * parameter from the DB
	 */
	@GET
	@Path("/coupon/date/{endDate}")
	public Coupon[] getCouponByEndDate(@Context HttpServletRequest request, @PathParam("endDate") String endDate)
			throws CouponSystemException {
		return getFacadeFromSession(request).getCouponByEndDate(Date.valueOf(endDate)).toArray(new Coupon[0]);
	}

	/**
	 * returns a Company object holding information about current company user
	 */
	@GET
	public Company returnCurrentCompany(@Context HttpServletRequest request) throws CouponSystemException {
		return getFacadeFromSession(request).returnCurrentCompany();
	}

	/**
	 * returns the facade attribute object from the session
	 * 
	 * @throws CouponSystemException
	 *             - if the facade object is not an instance of CompanyFacade
	 */
	private CompanyFacade getFacadeFromSession(HttpServletRequest request) throws CouponSystemException {
		HttpSession session = request.getSession(false);
		ClientFacade facade = (ClientFacade) session.getAttribute("facade");
		if (!(facade instanceof CompanyFacade)) {
			throw new CouponSystemException("unsupported user action");
		}
		return (CompanyFacade) facade;
	}
	
	
	/**
	 * checks to validate coupon input
	 * @throws CouponSystemException 
	 * */
	private void checkValidCoupon(Coupon coupon) throws CouponSystemException{
		String title=coupon.getTitle();
		String startDate=coupon.getStartDate();
		String endDate=coupon.getEndDate();
		Integer amount=coupon.getAmount();
		String type=coupon.getType();
		String message=coupon.getMessage();
		Double price=coupon.getPrice();
		if(title == null || title.length()<1 || startDate==null || startDate.length()<1 ||
				endDate==null || endDate.length()<1 || amount == null || amount<0 || type==null || 
				type.length()<1 || message==null || message.length()<1 || price==null || price<0 ){
			throw new CouponSystemException("missing feilds inputs in coupon form");
		}
	}

}
