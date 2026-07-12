import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class CleanDB {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/lms_toeic?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Ho_Chi_Minh", "root", "123456");
        Statement stmt = conn.createStatement();
        
        stmt.execute("SET FOREIGN_KEY_CHECKS = 0");
        
        ResultSet rs = stmt.executeQuery("SHOW TABLES");
        List<String> tables = new ArrayList<>();
        while (rs.next()) {
            tables.add(rs.getString(1));
        }
        
        for (String table : tables) {
            System.out.println("Dropping table " + table);
            stmt.execute("DROP TABLE IF EXISTS " + table);
        }
        
        stmt.execute("SET FOREIGN_KEY_CHECKS = 1");
        
        conn.close();
        System.out.println("Database cleaned successfully.");
    }
}
