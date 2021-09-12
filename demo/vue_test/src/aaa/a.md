某学习系统一个人可以拥有多个帐户，想要根据用户信息中的所有邮箱信息，把同一个人的不同账号进行合并，查询有多少独立用户，也就是说，两个账号即使姓名相同，它们也可能属于不同的人；只有账户信息中的相同邮箱，才能判定两个账号属于同一个人。阅读代码框内已给出的代码并完成需求。

import java.util.*;
public class AccountTest {
    public static List<List<String>> mergeUser(List<List<String>> users) {
        List<List<String>> resultList = new ArrayList<>();
        int[] userArray = new int[users.size()];
        for (int n = 0; n < userArray.length; n++) {
            userArray[n] = n;
        }
        Map<String, Integer> emailHashMap = new HashMap<>();
        Map<Integer, List<String>> positionHashMap = new HashMap<>();
        for (int i = 0; i < users.size(); i++) {
            for (int j = 1; j < users.get(i).size(); j++) {
                if (emailHashMap.containsKey(users.get(i).get(j))) {
                    union(userArray, i, emailHashMap.get(users.get(i).get(j)));
                } else {
                    emailHashMap.put(users.get(i).get(j), i);
                }
            }
        }
        for (Map.Entry<String, Integer> entry : emailHashMap.entrySet()) {
            int position = find(userArray, entry.getValue());
            if (positionHashMap.get(position) != null) {
                List<String> emailList = positionHashMap.get(position);
                emailList.add(entry.getKey());
                positionHashMap.put(position, emailList);
            } else {
                List<String> emailList = new ArrayList<>();
                emailList.add(entry.getKey());
                positionHashMap.put(position, emailList);
            }
        }
        for (int position : positionHashMap.keySet()) {
            List<String> userList = new ArrayList<>();
            userList.addAll(positionHashMap.get(position));
            userList.add(0, users.get(position).get(0));
            Collections.sort(userList);
            resultList.add(userList);
        }
        return resultList;
    }
    //No.1
    //开始写代码，请结合需求和代码，完善下面两个方法从而实现需求。
    private static int find(int[] array, int x) {
    }
    private static void union(int[] array, int from, int to) {
        int realFrom =
        int realTo =
        
    }
    //end_code
    public static void main(String[] args) {
        String users[][] = {{"Ray", "rayShell@softchina.com", "ray001@163.com"},
                {"Ray", "xiang@sina.com"},
                {"Ray", "rayShell@softchina.com", "rui_xiang@qq.com"},
                {"Linda", "lindazheng@softchina.com"},
                {"Linda", "lindazheng@softchina.com", "linda777@sina.com"}};
        List<List<String>> list = new ArrayList<List<String>>();
        for (int i = 0; i < users.length; i++) {
            List<String> userList = new ArrayList<String>();
            for (int j = 0; j < users[i].length; j++) {
                userList.add(users[i][j]);
            }
            list.add(userList);
        }
        /*按数据给出格式输出：[姓名, 邮箱1, ..., 邮箱n]（邮箱不考虑顺序，姓名不同但邮箱有重合的，返回其中一个姓名即可*/
List<List<String>> res = mergeUser(list);
    Iterator it = res.iterator();
        while (it.hasNext()) {
                System.out.println(it.next());
            }
        }
}


----
在日常工作中，服务器会有处理多个请求的情况，那么为了提高响应需求，缩短延迟时间，常常会对线程设计和优化，那么现在在不考虑操作顺序的情况下，请结合代码实现每一条消息一个线程的模式，详情描述，请看代码框
/**
 * 输入打印格式，每行字幕前后顺序不考虑，A打印10次，B打印20次，C打印30次
 * ABCBCABACABCCABACBBCACBABCACBA
 * BCBCCBBCBCBCBCBCBCCB
 * CCCCCCCCCC
 *
 * 我们可以在Helper类的 handle的方法中实现按照指定的次数显示字符，
 * 另外你也可以增加一定的休眠(比如100毫秒)来延缓显示速度，这是模拟在数据比较多的情况下
 * handle处理的费时操作
 * */
public class ThreadMsgTest {
    public static void main(String[] args){
        Host host = new Host();
        /*启动线程，打印10次A*/
        host.request(10,'A');
        /*启动线程，打印20次B*/
        host.request(20,'B');
        /*启动线程，打印30次C*/
        host.request(30,'C');
    }
}
//No.1
//开始写代码，请在下面写出实现需求的代码
class Host{
    
}
class Helper{
    
    
}
//end_code

---
JAVA反射机制是在运行状态中，对于任意一个实体类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为java语言的反射机制。那么请在代码中根据具体的要求实现获取方法的参数和返回值类型，

import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;
/**
 * 输出的数据
 * java.util.Map<java.lang.String, Person>
 * class java.lang.String
 * class Person
 * java.util.List<Person>
 * class Person
 * class java.lang.Integer
 * class Person
 * */
public class ReflectionTest {
    public void methodTest01(Map<String, Person> map, List<Person> list) {
        System.out.println("ReflectionTest.methodTest01()");
    }
    public Map<Integer, Person> methodTest02() {
        System.out.println("ReflectionTest.methodTest02()");
        return null;
    }
    /**
     * 获得methodTest01方法参数泛型信息
     */
public void getParameterInfo() {
    try {
        Method method = ReflectionTest.class.getMethod("methodTest01", Map.class, List.class);
        //No.1
        //开始写代码，请在这个方法中获得methodTest01方法参数泛型信息，并打印出来。
        Type[] t =
        //end_code
    } catch (Exception e) {
        e.printStackTrace();
    }
}
    /**
     * 获得methodTest02方法返回值泛型信息
     */
    public void getReturnValueInfo(){
        try {
            Method method = ReflectionTest.class.getMethod("methodTest02", null);
            //No.2
            //开始写代码，请在这个方法中获得methodTest01方法参数泛型信息，并打印出来。
            Type returnType =
            //end_code
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static void main(String[] args) {
        ReflectionTest reflectionTest = new ReflectionTest();
        reflectionTest.getParameterInfo();
        reflectionTest.getReturnValueInfo();
    }
}
class Person {
}

---
随着公司业务的增多，公司内部决定开发一个数据转换工具，需求是模拟将数据库中的数据转换成集中不同的文件格式，例如 txt、pdf ，同时需要满足支持不同的数据库，例如：MySql和Oracle。那么针对这个需求，请结合现有的代码框架，利用设计模式思想对其进行设计，并写出完成需求的代码。
备注：目前已知有一个转化器的抽象类Converter，和一个数据库的接口：DB，请实现：pdf转换器：ConverterPDF，txt转换器：ConverterTXT，Oracle数据库：DBOracle以及Mysql数据库：DBSQL


//No.1
//开始写代码，请结合现有代码和题目要求，在此实现转换器的代码。
abstract class Converter 
//end_code
interface DB {
    void fromDB();
}
//No.2
//开始写代码，请结合代码和题目要求，在这里实现数据库适配的代码
class DBOracle
//end_code
/*
* 测试类
* 最终输出的结果格式：
* 例如：SQL数据转PDF
* */
public class TestBridge {
    public static void main(String[] args) {
        /*从MySql数据库转换pdf文件*/
        Converter converterPDF = new ConverterPDF(new DBSQL());
        converterPDF.convert();
        /*从Oracle数据库转换txt文件*/
        Converter converterTXT = new ConverterTXT(new DBOracle());
        converterTXT.convert();
    }
}