package com.rest.app;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

import com.core.system.CouponSystem;
import com.rest.dataobjects.LoginParameters;
import com.rest.providers.ErrorProvider;
import com.rest.providers.IllegalArgumentProvider;
import com.rest.resources.AdminService;
import com.rest.resources.CompanyService;
import com.rest.resources.CustomerService;
import com.rest.resources.FileUploadManager;
import com.rest.resources.LoginService;

@ApplicationPath("/rest")
public class CouponApplication extends Application {
	
	@Override
	public Set<Object> getSingletons() {
		try {
			Class.forName("org.apache.derby.jdbc.ClientDriver");
			CouponSystem.getInstance();
		} catch (Exception e) {
			e.printStackTrace();
		}
		Set<Object> singletons=new HashSet<>();
		singletons.add(new AdminService());
		singletons.add(new CompanyService());
		singletons.add(new CustomerService());
		singletons.add(new FileUploadManager());
		singletons.add(new LoginService());
		singletons.add(new ErrorProvider());
		singletons.add(new IllegalArgumentProvider());
		singletons.add(new LoginParameters());
		
		return singletons;
	}

}
