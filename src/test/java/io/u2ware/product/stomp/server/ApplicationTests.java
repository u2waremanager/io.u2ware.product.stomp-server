package io.u2ware.product.stomp.server;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;


@SpringBootTest
@AutoConfigureMockMvc
class ApplicationTests {

	protected Log logger = LogFactory.getLog(getClass());

	@Autowired
	private MockMvc mvc;



	@Test
	void contextLoads() throws Exception {

		mvc
				.perform(
						MockMvcRequestBuilders.get("/")
				)
				.andExpect(
						MockMvcResultMatchers.status().is4xxClientError()
				)
				.andDo(
						MockMvcResultHandlers.print(System.err)
				);

	}

}
