import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import queryString from "query-string";

import { accountService, alertService } from "../../_services";

function VerifyEmail({ history }) {
  const EmailStatus = {
    Verifying: "Verifying",
    Failed: "Failed",
  };

  const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);
  const navigate = useNavigate();
  useEffect(() => {
    const { token } = queryString.parse(window.location.search);

    // remove token from url to prevent http referer leakage

    navigate(window.location.pathname, { replace: true });
    accountService
      .verifyEmail(token)
      .then(() => {
        alertService.success("Verification successful, you can now login", {
          keepAfterRouteChange: true,
        });
        // history.push("login");
        navigate("/login");
      })
      .catch(() => {
        setEmailStatus(EmailStatus.Failed);
      });
  }, []);

  function getBody() {
    switch (emailStatus) {
      case EmailStatus.Verifying:
        return <div>Verifying...</div>;
      case EmailStatus.Failed:
        return (
          <div>
            Verification failed, you can also verify your account using the{" "}
            <Link to="forgot-password">forgot password</Link> page.
          </div>
        );
    }
  }

  return (
    <div>
      <h3 className="card-header">Verify Email</h3>
      <div className="card-body">{getBody()}</div>
    </div>
  );
}

export { VerifyEmail };
