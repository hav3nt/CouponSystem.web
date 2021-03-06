package com.rest.dataobjects;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * An object representing the login parameters : user name, password and user type
 * */
@XmlRootElement
public class LoginParameters {
	
	private String userName;
	private String password;
	private String userType;
	
	public LoginParameters() {	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	@Override
	public String toString() {
		return "LoginParameters [userName=" + userName + ", password="
				+ password + ", userType=" + userType + "]";
	}

	
}
