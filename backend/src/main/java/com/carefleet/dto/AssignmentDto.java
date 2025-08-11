package com.carefleet.dto;

public class AssignmentDto {
    private String id;
    private String staffId;
    private String patientId;
    private String bedId;
    private String taskType;
    private String description;
    private String priority;
    private String status;
    private String scheduledTime;
    private String completedTime;
    private String notes;
    private String createdAt;
    private String updatedAt;

    public AssignmentDto() {}

    public AssignmentDto(String id, String staffId, String patientId, String bedId, String taskType,
                        String description, String priority, String status, String scheduledTime,
                        String completedTime, String notes, String createdAt, String updatedAt) {
        this.id = id;
        this.staffId = staffId;
        this.patientId = patientId;
        this.bedId = bedId;
        this.taskType = taskType;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.scheduledTime = scheduledTime;
        this.completedTime = completedTime;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getBedId() { return bedId; }
    public void setBedId(String bedId) { this.bedId = bedId; }

    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getCompletedTime() { return completedTime; }
    public void setCompletedTime(String completedTime) { this.completedTime = completedTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}