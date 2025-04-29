export async function predictDepression(data) {
  // Determine endpoint based on selected model
  let endpoint = "svm_lib"; // Default
  
  if (data.Model) {
    // Map model name to endpoint
    const modelEndpointMap = {
      "SVM_LIB": "svm_lib",
      "SVM_Scratch": "svm_scratch",
      "Logictis_LIB": "logistic_lib",
      "Logictis_Scratch": "logistic_scratch"
    };
    
    endpoint = modelEndpointMap[data.Model] || "svm_lib";
    console.log(`Using model endpoint: ${endpoint}`);
    
    // Remove Model from data as it's only used for routing
    const { Model, ...inputData } = data;
    data = inputData;
  }
  
  const response = await fetch(`http://localhost:8000/api/predict/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error("Prediction failed");
  }
  
  return await response.json();
}