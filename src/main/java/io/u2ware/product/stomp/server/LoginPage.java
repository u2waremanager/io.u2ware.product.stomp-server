package io.u2ware.product.stomp.server;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginPage {
	@GetMapping("/login")
	String login() {
        System.err.println("aaaaa");
		return "loginPage";
	}

	@GetMapping("/default-ui.css")
	String css() {
        System.err.println("aaaaa");
		return "default-ui.css";
	}

}