import { useEffect, useRef, useState } from "react";
import { Toast } from "bootstrap";
import styled from 'styled-components';
// ## style css area start ####  

const Container = styled.div`
/* Custom Toast Wrapper */
.custom-toast {
  border-radius: 14px;
  border-left: 5px solid #008479;
  box-shadow: 0 12px 30px rgba(0, 132, 121, 0.35);
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
}

/* Header */
.custom-toast .toast-header {
  background: linear-gradient(135deg, #008479, #00a193);
  color: #fff;
  border-bottom: none;
  padding: 10px 14px;
}

/* Title */
.custom-toast .toast-header strong {
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Time text */
.custom-toast .toast-header small {
  color: rgba(255, 255, 255, 0.8);
}

/* Close button */
.custom-toast .btn-close {
  filter: invert(1);
  opacity: 0.8;
}

.custom-toast .btn-close:hover {
  opacity: 1;
}

/* Body */
.custom-toast .toast-body {
  background: #f6fffd;
  color: #333;
  padding: 14px 16px;
  font-size: 14px;
}
.custom-toast {
  width: 360px;
  border: none;
  border-radius: 20px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(10, 23, 55, 0.15);
  border-left: 5px solid #d0021b; /* Hostelo red */
}

.custom-toast .toast-header {
  background: #0b1633; /* Hostelo navy */
  color: #ffffff;
  border-bottom: none;
  padding: 14px 18px;
}

.custom-toast .toast-header strong {
  font-size: 15px;
  font-weight: 600;
}

.custom-toast .toast-header small {
  color: rgba(255, 255, 255, 0.75);
}

.custom-toast .btn-close {
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.custom-toast .btn-close:hover {
  opacity: 1;
}

.custom-toast .toast-body {
  background: #ffffff;
  color: #5b6b88;
  font-size: 14px;
  line-height: 1.6;
  padding: 18px;
}

/* Optional notification dot effect */
/* .custom-toast::before {
  content: "";
  position: absolute;
  top: 18px;
  left: 16px;
  width: 10px;
  height: 10px;
  background: #d0021b;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(208, 2, 27, 0.15);
} */

.custom-toast .toast-header strong {
  margin-left: 18px;
}

/* Slide animation */
@keyframes slideIn {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

`;
const GlobalNotification = ({ fireBaseValue }) => {
console.log('my firebase message dynamic',fireBaseValue)

//     const toastRef = useRef(null);

//      useEffect(() => {
//     if (!fireBaseValue || !toastRef.current) return;

//     setVisible(true);

//    const toast = new Toast(toastRef.current, {
//   autohide: true,
//   delay: 5000,
// });

//     toast.show();

//     const timer = setTimeout(() => {
//       setVisible(false);
//       onClose?.();
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [fireBaseValue]);
    return (
        <Container>

            <div
                className="toast-container position-fixed top-0 end-0 p-3"
                style={{ zIndex: 9999 }}>
                <div
                    // ref={toastRef}
                    className="toast custom-toast"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">
                            {fireBaseValue?.title || "Welcome"}
                        </strong>
                    &nbsp; &nbsp;
                        <small>Just now</small>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="toast"
                            aria-label="Close" />
                    </div>
                    <div className="toast-body">
                        {fireBaseValue?.body || "Hello! Notification loaded successfully 🚀"}
                    </div>
                </div>
            </div>

            {/* notification  */}

        </Container>

    );
};

export default GlobalNotification;











