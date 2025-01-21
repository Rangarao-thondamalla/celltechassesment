interface FormField {
    type: string;
    label: string;
    options?: string[];
  }
  
  let formFields: FormField[] = [];
  
  // Function to render the form fields dynamically
  function renderFormFields() {
    const formFieldsContainer = document.getElementById("form-fields")!;
    formFieldsContainer.innerHTML = "";
  
    formFields.forEach((field, index) => {
      const fieldDiv = document.createElement("div");
      fieldDiv.className = "form-field mb-3";
  
      const label = document.createElement("label");
      label.textContent = field.label;
      label.className = "form-label";
  
      let input: HTMLInputElement | HTMLDivElement | any;
      if (field.type === "text") {
        input = document.createElement("input") as HTMLInputElement;
        input.type = "text"; // Cast to HTMLInputElement, so TypeScript understands the `type` property
        input.className = "form-control";
      } else if (field.type === "radio" || field.type === "checkbox") {
        input = document.createElement("div") as HTMLDivElement;
        field.options?.forEach((option) => {
          const optionLabel = document.createElement("label");
          const optionInput = document.createElement("input") as HTMLInputElement;
          optionInput.type = field.type as "radio" | "checkbox"; // Proper type casting
          optionInput.name = `field-${index}`;
          optionInput.value = option;
          optionInput.className = "form-check-input";
  
          optionLabel.className = "form-check-label";
          optionLabel.appendChild(optionInput);
          optionLabel.appendChild(document.createTextNode(option));
          input.appendChild(optionLabel);
        });
      }
  
      // Edit Button for fields
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.className = "btn btn-warning btn-sm me-2";
      editButton.onclick = () => editField(index); // Call editField function
  
      // Delete Button for fields
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.onclick = () => deleteField(index); // Call deleteField function
  
      // Append elements
      fieldDiv.appendChild(label);
      fieldDiv.appendChild(input);
      fieldDiv.appendChild(editButton);
      fieldDiv.appendChild(deleteButton);
      formFieldsContainer.appendChild(fieldDiv);
    });
  }
  
  // Function to edit a field during form creation
  function editField(index: number) {
    const field = formFields[index];
    const newLabel = prompt("Edit label for this field:", field.label);
    if (newLabel) {
      field.label = newLabel;
      renderFormFields();
    }
  }
  
  // Function to delete a field during form creation
  function deleteField(index: number) {
    formFields.splice(index, 1); // Remove field from array
    renderFormFields(); // Re-render the form fields
  }
  
  // Function to save the form structure to localStorage
  function saveForm() {
    const formName = prompt("Enter a name for your form:");
    if (!formName) {
      alert("Form name is required!");
      return;
    }
  
    // Check for duplicate form names
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    if (savedForms.some((form: { name: string }) => form.name === formName)) {
      alert("A form with this name already exists. Please choose a different name.");
      return;
    }
  
    const formStructure = {
      name: formName,
      fields: formFields,
    };
  
    // Save the new form to localStorage
    savedForms.push(formStructure);
    localStorage.setItem("forms", JSON.stringify(savedForms));
    alert("Form saved successfully!");
  
    renderSavedForms();  // Re-render saved forms
  }
  
  // Function to render saved forms from localStorage
  function renderSavedForms() {
    const savedFormsContainer = document.getElementById("saved-forms")!;
    savedFormsContainer.innerHTML = "";
  
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
  
    savedForms.forEach((form: { name: string, fields: FormField[] }, formIndex: number) => {
      const formDiv = document.createElement("div");
      formDiv.className = "form-preview mb-4 p-3 border rounded";
  
      const formTitle = document.createElement("h3");
      formTitle.textContent = form.name;
      formTitle.className = "text-center mb-3";
      formDiv.appendChild(formTitle);
  
      // Add Delete Button for form
      const deleteFormButton = document.createElement("button");
      deleteFormButton.textContent = "Delete Form";
      deleteFormButton.className = "btn btn-danger btn-sm";
      deleteFormButton.onclick = () => deleteForm(formIndex); // Delete form when clicked
  
      formDiv.appendChild(deleteFormButton);
  
      form.fields.forEach((field, fieldIndex) => {
        const fieldElement = document.createElement("div");
        fieldElement.className = "field-preview mb-2";
  
        const fieldLabel = document.createElement("strong");
        fieldLabel.textContent = field.label;
  
        let fieldInput: HTMLInputElement | HTMLDivElement |any;
        if (field.type === "text") {
          fieldInput = document.createElement("input") as HTMLInputElement;
          fieldInput.type = "text"; // Proper type casting
          fieldInput.className = "form-control";
        } else if (field.type === "radio" || field.type === "checkbox") {
          fieldInput = document.createElement("div") as HTMLDivElement;
          field.options?.forEach((option) => {
            const optionLabel = document.createElement("label");
            const optionInput = document.createElement("input") as HTMLInputElement;
            optionInput.type = field.type as "radio" | "checkbox"; // Proper type casting
            optionInput.value = option;
            optionInput.className = "form-check-input";
  
            optionLabel.className = "form-check-label";
            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(document.createTextNode(option));
            fieldInput.appendChild(optionLabel);
          });
        }
  
        // Edit Button for field in saved form
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "btn btn-warning btn-sm me-2";
        editButton.onclick = () => editFieldInSavedForm(formIndex, fieldIndex);  // Fixed reference to `editFieldInSavedForm`
  
        // Delete Button for field in saved form
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.onclick = () => deleteFieldInSavedForm(formIndex, fieldIndex); // Fixed reference to `deleteFieldInSavedForm`
  
        fieldElement.appendChild(fieldLabel);
        fieldElement.appendChild(fieldInput);
        fieldElement.appendChild(editButton);
        fieldElement.appendChild(deleteButton);
        formDiv.appendChild(fieldElement);
      });
  
      savedFormsContainer.appendChild(formDiv);
    });
  }
  
  // Function to delete a form from saved forms
  function deleteForm(formIndex: number) {
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    savedForms.splice(formIndex, 1); // Remove form from array
    localStorage.setItem("forms", JSON.stringify(savedForms)); // Update localStorage
    renderSavedForms(); // Re-render saved forms
  }
  
  // Function to edit a field in saved forms
  function editFieldInSavedForm(formIndex: number, fieldIndex: number) {
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    const form = savedForms[formIndex];
    const field = form.fields[fieldIndex];
  
    const newLabel = prompt("Edit label for this field:", field.label);
    if (newLabel) {
      field.label = newLabel;
      localStorage.setItem("forms", JSON.stringify(savedForms));
      renderSavedForms();  // Re-render saved forms
    }
  }
  
  // Function to delete a field in saved forms
  function deleteFieldInSavedForm(formIndex: number, fieldIndex: number) {
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
    savedForms[formIndex].fields.splice(fieldIndex, 1); // Remove field from form
    localStorage.setItem("forms", JSON.stringify(savedForms)); // Save updated form to localStorage
    renderSavedForms();  // Re-render saved forms
  }
  
  // Function to export form data as JSON
  function exportForm() {
    const savedForms = JSON.parse(localStorage.getItem("forms") || "[]");
  
    // Convert form data to JSON string
    const jsonData = JSON.stringify(savedForms, null, 2);
  
    // Create a blob with the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });
  
    // Create a temporary link element for downloading the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "form_data.json"; // The file name for the exported JSON
    link.click(); // Trigger the download
  }
  
  // Add event listeners for the form field buttons
  document.getElementById("add-text-field")!.addEventListener("click", () => {
    formFields.push({ type: "text", label: "Text Field" });
    renderFormFields();
  });
  
  document.getElementById("add-radio-field")!.addEventListener("click", () => {
    formFields.push({ type: "radio", label: "Radio Button", options: ["Option 1", "Option 2"] });
    renderFormFields();
  });
  
  document.getElementById("add-checkbox-field")!.addEventListener("click", () => {
    formFields.push({ type: "checkbox", label: "Checkbox", options: ["Option 1", "Option 2"] });
    renderFormFields();
  });
  
  // Add event listener for the Save Form button
  document.getElementById("save-form")!.addEventListener("click", saveForm);
  
  // Add event listener for the Export Form button
  document.getElementById("export-form")!.addEventListener("click", exportForm);
  
  // Render saved forms on page load
  window.onload = renderSavedForms;
  