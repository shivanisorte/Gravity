export const navigateBasedOnRole = (role, navigate) => {
    if (role === "hr") navigate("/hr-dashboard");
    else if (role === "manager") navigate("/manager-dashboard");
    else navigate("/employee-dashboard");
  };
  