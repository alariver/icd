/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package net.skyatlas.icd.webapi;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 *
 * @author changzhenghe
 */
@Controller
@RequestMapping(value = "/api")
public class GreetingController {
     private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();

    @RequestMapping(value = "/greeting", method = RequestMethod.GET)
    @ResponseBody
    public  Greeting greeting(
            @RequestParam(value="name", required=false, defaultValue="World") String name) {
        System.err.println("=========== greeting ==============");
        return new Greeting(counter.incrementAndGet(),
                            String.format(template, name));
    }
}
