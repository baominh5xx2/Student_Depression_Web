export async function predictDepression(data) {
  const response = await fetch("http://localhost:8000/api/predict/svm_lib", {
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