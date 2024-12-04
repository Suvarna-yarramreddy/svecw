import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ExternalFunded = () => {
  const [formData, setFormData] = useState({
    financialYear: "",
    applicationNumber: "",
    agency: "",
    scheme: "",
    piName: "",
    piDept: "",
    piContact: "",
    piEmail: "",
    copiName: "",
    copiDept: "",
    copiContact: "",
    copiEmail: "",
    duration: "",
    title: "",
    status: "",
    startDate: "",
    objectives: "",
    outcomes: "", // New field added for outcomes
  });

  const [errors, setErrors] = useState({});

const validateField = (name, value) => {
  let error = "";

  switch (name) {
    case "financialYear":
      if (!value || !/^\d+$/.test(value)) {
        error = "Financial Year should only contain numbers.";
      }
      break;
    case "applicationNumber":
      if (!value || !/^[a-zA-Z0-9]+$/.test(value)) {
        error = "Application Number should only contain letters and numbers.";
      }
      break;
    case "agency":
    case "scheme":
      if (!value || !/^[a-zA-Z\s]+$/.test(value)) {
        error = `${name === "agency" ? "Agency" : "Scheme"} should only contain letters.`;
      }
      break;
    case "piName":
      if (!value || !/^[a-zA-Z\s]+$/.test(value)) {
        error = "PI Name should only contain letters.";
      }
      break;
    case "piDept":
      if (!value || !/^[a-zA-Z\s]+$/.test(value)) {
        error = "PI Department should only contain letters.";
      }
      break;
    case "copiName":
      if (value && !/^[a-zA-Z\s]+$/.test(value)) {
        error = "Co-PI Name should only contain letters.";
      }
      break;
    case "copiDept":
      if (value && !/^[a-zA-Z\s]+$/.test(value)) {
        error = "Co-PI Department should only contain letters.";
      }
      break;
    case "piContact":
      if (!value || !/^\d{10}$/.test(value)) {
        error = "PI Contact Number must be a valid 10-digit number.";
      }
      break;
    case "copiContact":
      if (value && !/^\d{10}$/.test(value)) {
        error = "Co-PI Contact Number must be a valid 10-digit number.";
      }
      break;
    case "piEmail":
      if (!value || !/\S+@\S+\.\S+/.test(value)) {
        error = "PI Email must be a valid email.";
      }
      break;
    case "copiEmail":
      if (value && !/\S+@\S+\.\S+/.test(value)) {
        error = "Co-PI Email must be a valid email.";
      }
      break;
    case "title":
    case "objectives":
    case "outcomes":
      if (!value || !/^[a-zA-Z0-9\s.,]+$/.test(value)) {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} should only contain letters, numbers, spaces, and punctuation.`;
      }
      break;
    case "duration":
      if (!value || !/^[a-zA-Z0-9\s]+$/.test(value)) {
        error = "Duration should contain only numbers and text.";
      }
      break;
    case "startDate":
      if (!value) {
        error = "Start Date is required.";
      }
      break;
    case "status":
      if (!value) {
        error = "Status of the Project is required.";
      }
      break;
    default:
      break;
  }

  return error;
};

const validate = () => {
  let formErrors = {};

  // Validate PI details (mandatory)
  const mandatoryFields = ["piName", "piDept", "piContact", "piEmail"];
  mandatoryFields.forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) formErrors[field] = error;
  });

  // Validate Co-PI details (optional, only validate if provided)
  const optionalFields = ["copiName", "copiDept", "copiContact", "copiEmail"];
  optionalFields.forEach((field) => {
    if (formData[field]) {
      const error = validateField(field, formData[field]);
      if (error) formErrors[field] = error;
    }
  });

  // Validate other fields
  Object.keys(formData).forEach((key) => {
    if (!mandatoryFields.includes(key) && !optionalFields.includes(key)) {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    }
  });

  return formErrors;
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  // Real-time validation
  const fieldError = validateField(name, value);
  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: fieldError,
  }));
};

const handleSubmit = (e) => {
  e.preventDefault();
  const formErrors = validate();
  if (Object.keys(formErrors).length === 0) {
    console.log("Form Data Submitted:", formData);
    alert("Project Details Submitted Successfully!");
  } else {
    setErrors(formErrors);
    const firstErrorField = Object.keys(formErrors)[0];
    document.getElementsByName(firstErrorField)[0].scrollIntoView({ behavior: "smooth", block: "center" });
  }
};


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">External Funded Projects</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* General Information */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Financial Year</label>
            <input
              type="text"
              className="form-control"
              name="financialYear"
              value={formData.financialYear}
              onChange={handleChange}
            />
            {errors.financialYear && <div className="text-danger">{errors.financialYear}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Application Number</label>
            <input
              type="text"
              className="form-control"
              name="applicationNumber"
              value={formData.applicationNumber}
              onChange={handleChange}
            />
            {errors.applicationNumber && <div className="text-danger">{errors.applicationNumber}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Agency</label>
            <input
              type="text"
              className="form-control"
              name="agency"
              value={formData.agency}
              onChange={handleChange}
            />
            {errors.agency && <div className="text-danger">{errors.agency}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Scheme</label>
            <input
              type="text"
              className="form-control"
              name="scheme"
              value={formData.scheme}
              onChange={handleChange}
            />
            {errors.scheme && <div className="text-danger">{errors.scheme}</div>}
          </div>
        </div>

        {/* PI Credentials */}
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Name of the PI</label>
              <input
                type="text"
                className="form-control"
                name="piName"
                value={formData.piName}
                onChange={handleChange}
              />
              {errors.piName && <div className="text-danger">{errors.piName}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Department of PI</label>
              <input
                type="text"
                className="form-control"
                name="piDept"
                value={formData.piDept}
                onChange={handleChange}
              />
              {errors.piDept && <div className="text-danger">{errors.piDept}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Number of PI</label>
              <input
                type="text"
                className="form-control"
                name="piContact"
                value={formData.piContact}
                onChange={handleChange}
              />
              {errors.piContact && <div className="text-danger">{errors.piContact}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email id of PI</label>
              <input
                type="email"
                className="form-control"
                name="piEmail"
                value={formData.piEmail}
                onChange={handleChange}
              />
              {errors.piEmail && <div className="text-danger">{errors.piEmail}</div>}
            </div>
          </div>

          {/* Co-PI Credentials (Optional) */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Name of the Co-PI</label>
              <input
                type="text"
                className="form-control"
                name="copiName"
                value={formData.copiName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department of Co-PI</label>
              <input
                type="text"
                className="form-control"
                name="copiDept"
                value={formData.copiDept}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Number of Co-PI</label>
              <input
                type="text"
                className="form-control"
                name="copiContact"
                value={formData.copiContact}
                onChange={handleChange}
              />
              {errors.copiContact && <div className="text-danger">{errors.copiContact}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email id of Co-PI</label>
              <input
                type="email"
                className="form-control"
                name="copiEmail"
                value={formData.copiEmail}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Duration of Project</label>
            <input
              type="text"
              className="form-control"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />
            {errors.duration && <div className="text-danger">{errors.duration}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Title of the Project</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </div>
          <div className="col-md-6 mb-3">
  <label className="form-label">
    Status of the Project 
  </label>
  <select
    className="form-select"
    name="status"
    value={formData.status}
    onChange={handleChange}
  >
    <option value="">Select the status</option>
    <option value="ongoing">Ongoing</option>
    <option value="completed">Completed</option>
    <option value="applied">Applied</option>
  </select>
  {errors.status && <div className="text-danger">{errors.status}</div>}
</div>


          <div className="col-md-6 mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
            {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Objectives of the Project</label>
            <textarea
              className="form-control"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
            />
            {errors.objectives && <div className="text-danger">{errors.objectives}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Outcomes of the Project</label>
            <textarea
              className="form-control"
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
            />
            {errors.outcomes && <div className="text-danger">{errors.outcomes}</div>}
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            Submit Project Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExternalFunded;