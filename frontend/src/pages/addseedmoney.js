import React, { useState } from 'react';
import { useFaculty } from "./facultyContext";
import { useNavigate } from "react-router-dom";
function SeedMoneyPage() {
  const {faculty_id} = useFaculty();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    financialYear: '',
    facultyName: '',
    department: '',
    numStudents: '',
    projectTitle: '',
    amountSanctioned: '',
    amountReceived: '',
    objectives: '',
    outcomes: '',
    proof: null,
    students: [{ registration: '', name: '' }]
  });

  const [errors, setErrors] = useState({});

  const validations={
    facultyName: /^[A-Za-z\s]+$/,  // Only text
    department: /^[A-Za-z\s]+$/,  // Only text
    registration: /^[A-Za-z0-9]+$/,  // Alphanumeric
    projectTitle: /^[A-Za-z0-9\s]+$/,  // Alphanumeric
    amountSanctioned: /^\d+$/,  // Only numbers
    amountReceived: /^\d+$/,  // Only numbers
    objectives: /^[A-Za-z0-9\s]+$/,  // Alphanumeric
    outcomes: /^[A-Za-z0-9\s]+$/,  // Alphanumeric

  };
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index][field] = value;
    setFormData({ ...formData, students: updatedStudents });
  };

  const handleNumStudentsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const students = value > 0 ? Array.from({ length: value }, () => ({ registration: '', name: '' })):[];
    setFormData((prevData) => ({ ...prevData, numStudents: value, students }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];  // Get the first file selected
    setFormData((prevData) => ({ ...prevData, proof: file }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate fields based on the regular expressions
    Object.keys(formData).forEach((key) => {
      if (validations[key] && formData[key] && !validations[key].test(formData[key])) {
        switch (key) {
          case 'facultyName':
            newErrors[key] = 'Faculty name should contain only letters.';
            break;
          case 'department':
            newErrors[key] = 'Department should contain only letters.';
            break;
          case 'registration':
            newErrors[key] = 'Registration number should contain only alphanumeric characters.';
            break;
          case 'projectTitle':
            newErrors[key] = 'Project title should contain only alphanumeric characters.';
            break;
          case 'amountSanctioned':
            newErrors[key] = 'Amount sanctioned should contain only numbers.';
            break;
          case 'amountReceived':
            newErrors[key] = 'Amount received should contain only numbers.';
            break;
          case 'objectives':
            newErrors[key] = 'Objectives should contain only alphanumeric characters.';
            break;
          case 'outcomes':
            newErrors[key] = 'Outcomes should contain only alphanumeric characters.';
            break;
          default:
            newErrors[key] = `${key} is invalid.`;
        }
      }
    });

    // Validate students details
    formData.students.forEach((student, index) => {
      if (!validations.registration.test(student.registration)) {
        newErrors[`registration-${index}`] = `Registration Number (Student ${index + 1}) is invalid.`;
      }
      if (!validations.department.test(student.name)) {
        newErrors[`name-${index}`] = `Name (Student ${index + 1}) is invalid.`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
        // Form is valid, prepare the data to be sent
        const formDataToSend = new FormData();
        formDataToSend.append('faculty_id', faculty_id); // Add faculty_id from context
        formDataToSend.append('financialYear', formData.financialYear);
        formDataToSend.append('facultyName', formData.facultyName);
        formDataToSend.append('department', formData.department);
        formDataToSend.append('numStudents', formData.numStudents);
        formDataToSend.append('projectTitle', formData.projectTitle);
        formDataToSend.append('amountSanctioned', formData.amountSanctioned);
        formDataToSend.append('amountReceived', formData.amountReceived);
        formDataToSend.append('objectives', formData.objectives);
        formDataToSend.append('outcomes', formData.outcomes);

        // Handle file upload only if 'proof' is provided
        if (formData.proof) {
            formDataToSend.append('proof', formData.proof);  // Ensure this is a File object
        }

        // Handle students dynamically (if there are multiple students)
        formData.students.forEach((student, index) => {
            formDataToSend.append(`students[${index}][registration]`, student.registration);
            formDataToSend.append(`students[${index}][name]`, student.name);
        });

        try {
            // Send form data to backend (server)
            const response = await fetch('http://localhost:5002/addSeedMoney', {
                method: 'POST',
                body: formDataToSend,  // Send FormData instead of JSON
            });

            // Check the response content type
            const contentType = response.headers.get('Content-Type');
            let data;

            // If the response is JSON, parse it
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();  // Parse response as JSON
            } else {
                // Handle plain text or other response types
                data = await response.text();  // Read the response as plain text
            }

            if (response.ok) {
                alert(data.message || data); // Show success message or the text response

                if (data.message === 'Form submitted successfully!') {
                    // Reset the form after successful submission
                    setFormData({
                        financialYear: '',
                        facultyName: '',
                        department: '',
                        numStudents: 0,
                        projectTitle: '',
                        amountSanctioned: '',
                        amountReceived: '',
                        objectives: '',
                        outcomes: '',
                        proof: null,
                        students: [{ registration: '', name: '' }]
                    });
                }
                if(response.status===200){
                  navigate("/viewseedmoney");
                }
            } else {
                console.error('Error:', data);
                alert('Failed to submit the form: ' + (data.message || data));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit the form due to network issues');
        }
    } else {
        // If form is invalid, scroll to the first error field
        const firstErrorField = Object.keys(errors)[0];
        const errorField = document.querySelector(`[name=${firstErrorField}]`);
        if (errorField) {
            errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Seed Money Application</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Financial Year</label>
            <select
            className="form-select"
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
            >
              <option value="">Select Financial Year</option>
              <option value="2020-21">2020-21</option>
              <option value="2021-22">2021-22</option>
              <option value="2022-23">2022-23</option>
              <option value="2024-25">2024-25</option>
              </select>
              {errors.financialYear && <div className="text-danger">{errors.financialYear}</div>}
            </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Faculty Name</label>
            <input
              type="text"
              className="form-control"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
            />
            {errors.facultyName && <div className="text-danger">{errors.facultyName}</div>}
          </div>
          </div>
          <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Department</label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <div className="text-danger">{errors.department}</div>}
          </div>
        {/* Student Details */}
        
          <div className="col-md-6 mb-3">
            <label className="form-label">Number of Students Involved</label>
            <input
              type="number"
              className="form-control"
              name="numStudents"
              value={formData.numStudents}
              onChange={handleNumStudentsChange}
              min="0"
            />
          </div>
        </div>

        {formData.numStudents > 0 && formData.students.map((student, index) => (
          <div className="row" key={index}>
            <div className="col-md-6 mb-3">
              <label className="form-label">Registration Number (Student {index + 1})</label>
              <input
                type="text"
                className="form-control"
                name="registration"
                value={student.registration}
                onChange={(e) => handleStudentChange(index, 'registration', e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Name (Student {index + 1})</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={student.name}
                onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* Project Details */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title of the Project</label>
            <input
              type="text"
              className="form-control"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
            />
            {errors.projectTitle && <div className="text-danger">{errors.projectTitle}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Amount Sanctioned (in Rupees)</label>
            <input
              type="text"
              className="form-control"
              name="amountSanctioned"
              value={formData.amountSanctioned}
              onChange={handleChange}
            />
            {errors.amountSanctioned && <div className="text-danger">{errors.amountSanctioned}</div>}
          </div>
          <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Amount Received (in Rupees)</label>
            <input
              type="text"
              className="form-control"
              name="amountReceived"
              value={formData.amountReceived}
              onChange={handleChange}
            />
            {errors.amountReceived && <div className="text-danger">{errors.amountReceived}</div>}
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Objectives of the Project</label>
            <textarea
              className="form-control"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              style={{ height: '30%' }}
            />
            {errors.objectives && <div className="text-danger">{errors.objectives}</div>}
          </div>
          </div>
          <div className='row'>
          <div className="col-md-6 mb-3">
            <label className="form-label">Outcomes of the Project</label>
            <textarea
              className="form-control"
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
              style={{ height: '30%' }}
            />
            {errors.outcomes && <div className="text-danger">{errors.outcomes}</div>}
          </div>
        

        <div className="col-md-6 mb-3">
            <label className="form-label">Upload Proof (Optional)</label>
            <input
              type="file"
              className="form-control"
              name="proof"
              onChange={handleFileChange}
            />
            {formData.proof && (
              <div className="mt-2">Selected file: {formData.proof.name}</div>
            )}
          </div>
        </div>
        </div>
        
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            Submit Seed Money Details
          </button>
        </div>
      </form>
    </div>
  );
}

export default SeedMoneyPage;
