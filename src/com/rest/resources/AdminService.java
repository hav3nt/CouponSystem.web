package com.rest.resources;

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
import com.core.beans.Customer;
import com.core.exceptions.CouponSystemException;
import com.core.facades.AdminFacade;
import com.core.facades.ClientFacade;

@Path("/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminService {

	/**
	 * sends a Company object to insert to the DB as a new company returns a
	 * company object after updating it with new created company ID on DB
	 */
	@POST
	@Path("/company")
	public Company createCompany(@Context HttpServletRequest request, Company company) throws CouponSystemException {
		checkValidCompany(company);
		company.setId(getFacadeFromSession(request).createCompany(company));
		return company;
	}

	/**
	 * returns a Company from DB with ID equals to the method parameter
	 */
	@GET
	@Path("/company/{id}")
	public Company readCompany(@Context HttpServletRequest request, @PathParam("id") long id)
			throws CouponSystemException {
		return getFacadeFromSession(request).readCompany(id);
	}

	/**
	 * updates a company on DB and returns an updated Company read from the DB
	 */
	@PUT
	@Path("/company")
	public Company updateCompany(@Context HttpServletRequest request, Company company) throws CouponSystemException {
		checkValidCompany(company);
		AdminFacade adminFacade = getFacadeFromSession(request);
		Company currentDBCompany = adminFacade.readCompany(company.getId());
		// checks if the password or email was changed before sending an update
		// to DB
		if (!(currentDBCompany.getPassword().equals(company.getPassword())
				&& currentDBCompany.getEmail().equals(company.getEmail()))) {
			adminFacade.updateCompany(company);
		}
		currentDBCompany = adminFacade.readCompany(company.getId());
		return currentDBCompany;
	}

	/**
	 * deletes a Company from the DB and returns a Company object representing
	 * the deleted Company
	 */
	@DELETE
	@Path("/company/{id}")
	public Company deleteCompany(@Context HttpServletRequest request, @PathParam("id") long id)
			throws CouponSystemException {
		AdminFacade adminFacade = getFacadeFromSession(request);
		// retrieves company from the DB to send a company object with ID and
		// name, to pass written restrictions in the facade method
		Company company = adminFacade.readCompany(id);
		adminFacade.deleteCompany(company);
		return company;
	}

	/**
	 * returns an array of Companies from the DB
	 */
	@GET
	@Path("/company")
	public Company[] getAllCompanies(@Context HttpServletRequest request) throws CouponSystemException {
		return getFacadeFromSession(request).getAllCompanies().toArray(new Company[0]);
	}

	/**
	 * sends a Customer object to insert to the DB as a new Customer returns a
	 * Customer object after updating it with new created Customer ID on DB
	 */
	@POST
	@Path("/customer")
	public Customer createCustomer(@Context HttpServletRequest request, Customer customer)
			throws CouponSystemException {
		checkValidCustomer(customer);
		customer.setId(getFacadeFromSession(request).createCustomer(customer));
		return customer;
	}

	/**
	 * returns a Customer from DB with ID equals to the method parameter
	 */
	@GET
	@Path("/customer/{id}")
	public Customer readCustomer(@Context HttpServletRequest request, @PathParam("id") long id)
			throws CouponSystemException {
		return getFacadeFromSession(request).readCustomer(id);
	}

	/**
	 * updates a Customer on DB and returns an updated Customer read from the DB
	 */
	@PUT
	@Path("/customer")
	public Customer updateCustomer(@Context HttpServletRequest request, Customer customer)
			throws CouponSystemException {
		checkValidCustomer(customer);
		AdminFacade adminFacade = getFacadeFromSession(request);
		Customer currentDBCustomer = adminFacade.readCustomer(customer.getId());
		// comparing parameter coupon with the coupon in DB if an update is
		// needed
		if (!currentDBCustomer.getPassword().equals(customer.getPassword())) {
			adminFacade.updateCustomer(customer);
		}
		currentDBCustomer = adminFacade.readCustomer(customer.getId());
		return currentDBCustomer;
	}

	/**
	 * deletes a Customer from the DB and returns a Customer object representing
	 * the deleted Customer
	 */
	@DELETE
	@Path("/customer/{id}")
	public Customer deleteCustomer(@Context HttpServletRequest request, @PathParam("id") long id)
			throws CouponSystemException {
		AdminFacade adminFacade = getFacadeFromSession(request);
		// retrieves customer from the DB to send a customer object with ID and
		// name, to pass written restrictions in the facade method
		Customer customer = adminFacade.readCustomer(id);
		adminFacade.deleteCustomer(customer);
		return customer;
	}

	/**
	 * returns an array of Customers from the DB
	 */
	@GET
	@Path("/customer")
	public Customer[] getAllCustomers(@Context HttpServletRequest request) throws CouponSystemException {
		return getFacadeFromSession(request).getAllCustomers().toArray(new Customer[0]);
	}

	/**
	 * returns the facade attribute object from the session
	 * 
	 * @throws CouponSystemException
	 *             - if the facade object is not an instance of AdminFacade
	 */
	private AdminFacade getFacadeFromSession(HttpServletRequest request) throws CouponSystemException {
		HttpSession session = request.getSession(false);
		ClientFacade facade = (ClientFacade) session.getAttribute("facade");
		if (!(facade instanceof AdminFacade)) {
			throw new CouponSystemException("unsupported user action");
		}
		return (AdminFacade) facade;
	}
	
	/**
	 * validates the company input, if invalid input found, throws CouponSystemException
	 * @throws CouponSystemException 
	 * */
	private void checkValidCompany(Company company) throws CouponSystemException{
		String companyName=company.getCompanyName();
		String password=company.getPassword();
		String email=company.getEmail();
		if(companyName== null  ||  companyName.length()<1   || password==null  || password.length()<1 
				|| email == null  || email.length()<1){
			throw new CouponSystemException("missing feilds inputs in company form");
		}
	}
	
	/**
	 * validates the customer input, if invalid input found, throws CouponSystemException
	 * @throws CouponSystemException 
	 * */
	private void checkValidCustomer(Customer customer) throws CouponSystemException{
		String customerName=customer.getCustomerName();
		String password=customer.getPassword();
		if(customerName== null  ||  customerName.length()<1   || password==null  || password.length()<1 ){
			throw new CouponSystemException("missing feilds inputs in customer form");
		}
	}
	
}
