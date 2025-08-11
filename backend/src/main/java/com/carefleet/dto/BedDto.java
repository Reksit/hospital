package com.carefleet.dto;

public class BedDto {
    private String id;
    private String hospitalId;
    private String bedNumber;
    private String type;
    private String status;
    private String patientId;
    private String assignedStaffId;
    private String createdAt;
    private String updatedAt;

    public BedDto() {}

    public BedDto(String id, String hospitalId, String bedNumber, String type, String status,
                  String patientId, String assignedStaffId, String createdAt, String updatedAt) {
        this.id = id;
        this.hospitalId = hospitalId;
        this.bedNumber = bedNumber;
        this.type = type;
        this.status = status;
        this.patientId = patientId;
        this.assignedStaffId = assignedStaffId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHospitalId() { return hospitalId; }
    public void setHospitalId(String hospitalId) { this.hospitalId = hospitalId; }

    public String getBedNumber() { return bedNumber; }
    public void setBedNumber(String bedNumber) { this.bedNumber = bedNumber; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(String assignedStaffId) { this.assignedStaffId = assignedStaffId; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}