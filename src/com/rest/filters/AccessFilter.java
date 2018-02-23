package com.rest.filters;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

// checks if client had logged in and that a session is present
@WebFilter("/rest/*")
public class AccessFilter implements Filter {

	public AccessFilter() {
	}

	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpSession session = httpRequest.getSession(false);
		String requestURI = httpRequest.getRequestURI();
		if (requestURI.startsWith("/CouponSystem.web/rest/login")) {
			chain.doFilter(request, response);
		} else {
			if (session != null) {
				if (session.getAttribute("facade") != null) {
					chain.doFilter(request, response);
					return;
				}
			}
			HttpServletResponse httpResponse = (HttpServletResponse) response;
			httpResponse.setContentType("application/json");
			PrintWriter out = httpResponse.getWriter();
			out.print("{\"error\":\"Please refresh page and re log in to the system\"}");
			httpResponse.sendError(httpResponse.SC_UNAUTHORIZED);
		}

	}

	public void init(FilterConfig fConfig) throws ServletException {
	}

}
