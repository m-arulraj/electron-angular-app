import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.*;

@Controller
public class ApplicationController {

    @GetMapping("/applications")
    public String getApplications(Model model) {
        // Sample data with application names, versions, and team names
        List<Application> applications = Arrays.asList(
            new Application("App1", Arrays.asList("1.2.0", "1.3.0"), "Team A"),
            new Application("App2", Arrays.asList("1.2.0"), "Team B"),
            new Application("App3", Arrays.asList("1.3.0"), "Team A")
        );

        // Extract the unique versions
        Set<String> uniqueVersions = new HashSet<>();
        for (Application app : applications) {
            uniqueVersions.addAll(app.getVersions());
        }

        model.addAttribute("applications", applications);
        model.addAttribute("versions", new ArrayList<>(uniqueVersions));

        return "applications"; // The name of the freemarker template (applications.ftl)
    }

    // Application model class
    public static class Application {
        private String name;
        private List<String> versions;
        private String team;

        public Application(String name, List<String> versions, String team) {
            this.name = name;
            this.versions = versions;
            this.team = team;
        }

        public String getName() {
            return name;
        }

        public List<String> getVersions() {
            return versions;
        }

        public String getTeam() {
            return team;
        }
    }
}
