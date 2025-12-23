package io.u2ware.product.stomp.server.oauth2;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureRestDocs
public class Oauth2Tests {
    

    protected Log logger = LogFactory.getLog(getClass());

    protected @Autowired MockMvc mvc;
    
	protected @Autowired Oauth2Docs od;	


    @Test
    public void contextLoads() throws Exception{

        // Jwt u1 = od.jose("oauth2User");


        // mvc.perform(get("/api/oauth2/userinfo").auth(u1)).andDo(print()) .andExpect(is2xx());


    }

}
