package com.project.TodoApp.dto;

import java.util.Collection;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
public class UserDTO {
    @Setter
    private Long userId;
    private String email;
    private String password;
    private Collection<String> roles;
    private String initials; // Hinzufügen des Initialen-Feldes


    public UserDTO(Long userId, String email, String password) {
        this.userId = userId;
        this.email = email;
        this.password = password;
        this.initials = generateInitials(email); // Initialen generieren
    }



    public void setEmail(String email) {
        this.email = email;
        this.initials = generateInitials(email); // Initialen generieren bei E-Mail-Änderung
    }


    private String generateInitials(String email) {
        if (email == null || email.isEmpty()) {
            return "";
        }
        String[] parts = email.split("@")[0].split("\\.");
        StringBuilder initials = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(part.charAt(0));
            }
        }
        return initials.toString().toUpperCase();
    }
}
