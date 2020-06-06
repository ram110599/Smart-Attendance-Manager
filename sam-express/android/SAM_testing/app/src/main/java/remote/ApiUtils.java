package remote;

/**
 * Created by SAHIL on 06-06-2020.
 */

public class ApiUtils {
    public static final String BASE_URL = "http://192.168.43.150:8000/";

    public static UserService getUserService(){
        return RetrofitClient.getClient(BASE_URL).create(UserService.class);
    }
}
