import React from 'react';
import { FaBuilding, FaGraduationCap, FaSearchDollar } from 'react-icons/fa';
import './TopHiringCompanies.css';

const TopHiringCompanies = () => {
  // Data for top hiring companies by batch
  const hiringData = {
    batch2024: {
      title: "Top Companies Hiring 2024 Batch",
      companies: [
        { name: "Microsoft", roles: ["Software Engineer", "Product Manager", "Data Analyst"], packages: "12-25 LPA" },
        { name: "Google", roles: ["Software Developer", "Associate Product Manager", "UX Designer"], packages: "15-30 LPA" },
        { name: "Amazon", roles: ["SDE I", "Business Analyst", "Cloud Support"], packages: "10-28 LPA" },
        { name: "Adobe", roles: ["MTS", "Product Consultant", "Data Scientist"], packages: "14-25 LPA" },
        { name: "Goldman Sachs", roles: ["Analyst", "Technology Analyst", "Operations Analyst"], packages: "18-35 LPA" },
      ]
    },
    batch2023: {
      title: "Top Companies Hiring 2023 Batch",
      companies: [
        { name: "TCS", roles: ["System Engineer", "Business Analyst"], packages: "3.6-7 LPA" },
        { name: "Infosys", roles: ["Systems Engineer", "Process Specialist"], packages: "3.5-8 LPA" },
        { name: "Wipro", roles: ["Project Engineer", "Data Analyst"], packages: "3.5-6.5 LPA" },
        { name: "HCL", roles: ["Graduate Engineer", "Software Developer"], packages: "4-7 LPA" },
        { name: "Tech Mahindra", roles: ["Associate Engineer", "Software Engineer"], packages: "3.25-5.5 LPA" },
      ]
    },
    batch2022: {
      title: "Top Companies Hiring 2022 Batch",
      companies: [
        { name: "Accenture", roles: ["Associate Software Engineer", "System and Application Services"], packages: "4.5-8 LPA" },
        { name: "Cognizant", roles: ["Programmer Analyst", "Process Executive"], packages: "4-7.5 LPA" },
        { name: "Capgemini", roles: ["Software Engineer", "Consultant"], packages: "4-7 LPA" },
        { name: "Deloitte", roles: ["Business Technology Analyst", "Risk Advisory"], packages: "6-10 LPA" },
        { name: "IBM", roles: ["Associate System Engineer", "Application Developer"], packages: "4.5-8 LPA" },
      ]
    }
  };

  return (
    <div className="hiring-companies-container">
      <h2 className="section-title">
        <FaBuilding className="icon" /> Top Hiring Companies for Freshers
      </h2>
      
      <div className="selection-tabs">
        <button className="tab-btn active">2024 Batch</button>
        <button className="tab-btn">2023 Batch</button>
        <button className="tab-btn">2022 Batch</button>
      </div>

      <div className="companies-grid">
        {hiringData.batch2024.companies.map((company, index) => (
          <div key={index} className="company-card">
            <h3 className="company-name">{company.name}</h3>
            <div className="company-roles">
              <FaGraduationCap className="icon" />
              <div>
                <strong>Roles:</strong>
                <ul>
                  {company.roles.map((role, i) => (
                    <li key={i}>{role}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="company-package">
              <FaSearchDollar className="icon" />
              <span><strong>Package:</strong> {company.packages}</span>
            </div>
            <button className="apply-btn">View Openings</button>
          </div>
        ))}
      </div>
      
      <div className="hiring-tips">
        <h3>Hiring Tips:</h3>
        <ul>
          <li>✓ Update your resume with relevant projects and skills</li>
          <li>✓ Practice data structures and algorithms regularly</li>
          <li>✓ Prepare for behavioral interviews (STAR method)</li>
          <li>✓ Build a strong LinkedIn/GitHub profile</li>
          <li>✓ Network with professionals in your target companies</li>
        </ul>
      </div>
    </div>
  );
};

export default TopHiringCompanies;
