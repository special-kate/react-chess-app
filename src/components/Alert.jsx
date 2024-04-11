import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { alertService, AlertType } from "../_services";
import { history } from "../_helpers";

const propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
};

const defaultProps = {
  id: "default-alert",
  fade: true,
};

function Alert({ id, fade }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = alertService.onAlert(id).subscribe((alert) => {
      console.log("alert", alert.message);

      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          filteredAlerts.forEach((x) => delete x.keepAfterRouteChange);
          return filteredAlerts;
        });
      } else {
        // add alert to array
        setAlerts((alerts) => [...alerts, alert]);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 10000);
        }
      }
    });

    // clear alerts on location change
    const historyUnlisten = () => {
      // don't clear if pathname has trailing slash because this will be auto redirected again
      if (history.pathname && history.pathname.endsWith("/")) return;

      alertService.clear(id);
    };

    // clean up function that runs when the component unmounts
    return () => {
      // unsubscribe & unlisten to avoid memory leaks
      subscription.unsubscribe();
      historyUnlisten();
    };
  }, []);

  function removeAlert(alert) {
    if (fade) {
      // fade out alert
      const alertWithFade = { ...alert, fade: true };
      setAlerts((alerts) =>
        alerts.map((x) => (x === alert ? alertWithFade : x))
      );

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x !== alertWithFade));
      }, 250);
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x !== alert));
    }
  }

  function cssClasses(alert) {
    if (!alert) return;

    const classes = ["alert", "alert-dismissable"];

    const alertTypeClass = {
      [AlertType.Success]:
        "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded absolute",
      [AlertType.Error]:
        "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded absolute",
      [AlertType.Info]:
        "bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded absolute",
      [AlertType.Warning]:
        "bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded absolute",
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push("fade");
    }

    return classes.join(" ");
  }

  if (!alerts.length) return null;

  return (
    <div className="container">
      <div className="m-3 flex justify-end">
        {alerts.map((alert, index) => (
          <div key={index} className={cssClasses(alert)} role="alert">
            <a className="close" onClick={() => removeAlert(alert)}>
              &times;{" "}
            </a>
            <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
          </div>
        ))}
      </div>
    </div>
  );
}

Alert.propTypes = propTypes;
Alert.defaultProps = defaultProps;
export { Alert };
