webpackHotUpdate("main_window",{

/***/ "./src/react/index.tsx":
/*!*****************************!*\
  !*** ./src/react/index.tsx ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App */ "./src/react/App.tsx");
/* harmony import */ var _util_axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/axios */ "./src/react/util/axios.ts");




var ipcRenderer = window.require("electron").ipcRenderer;
ipcRenderer.send("GET_API_ENDPOINT", "ping");
ipcRenderer.on("RESPONSE_API_ENDPOINT", function (_, arg) {
    Object(_util_axios__WEBPACK_IMPORTED_MODULE_3__["setApi"])(parseInt(arg));
    console.log("port", arg);
    react_dom__WEBPACK_IMPORTED_MODULE_1__["render"](react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_App__WEBPACK_IMPORTED_MODULE_2__["default"], null), document.getElementById("root"));
});
//render only if everything worked


/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcmVhY3QvaW5kZXgudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUEwQjtBQUNZO0FBQ2Q7QUFDYztBQUM5QixlQUFXLEdBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBL0IsQ0FBZ0M7QUFFbkQsV0FBVyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM3QyxXQUFXLENBQUMsRUFBRSxDQUFDLHVCQUF1QixFQUFFLFVBQUMsQ0FBTSxFQUFFLEdBQVE7SUFDdkQsMERBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN6QixnREFBZSxDQUFDLDJEQUFDLDRDQUFHLE9BQUcsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDNUQsQ0FBQyxDQUFDLENBQUM7QUFFSCxrQ0FBa0MiLCJmaWxlIjoibWFpbl93aW5kb3cuYzA1YmU1ODAyOTI5M2UzMGE2MDcuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSBcInJlYWN0LWRvbVwiO1xyXG5pbXBvcnQgQXBwIGZyb20gXCIuL0FwcFwiO1xyXG5pbXBvcnQgeyBzZXRBcGkgfSBmcm9tIFwiLi91dGlsL2F4aW9zXCI7XHJcbmNvbnN0IHsgaXBjUmVuZGVyZXIgfSA9IHdpbmRvdy5yZXF1aXJlKFwiZWxlY3Ryb25cIik7XHJcblxyXG5pcGNSZW5kZXJlci5zZW5kKFwiR0VUX0FQSV9FTkRQT0lOVFwiLCBcInBpbmdcIik7XHJcbmlwY1JlbmRlcmVyLm9uKFwiUkVTUE9OU0VfQVBJX0VORFBPSU5UXCIsIChfOiBhbnksIGFyZzogYW55KSA9PiB7XHJcbiAgc2V0QXBpKHBhcnNlSW50KGFyZykpO1xyXG4gIGNvbnNvbGUubG9nKFwicG9ydFwiLCBhcmcpO1xyXG4gIFJlYWN0RE9NLnJlbmRlcig8QXBwIC8+LCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikpO1xyXG59KTtcclxuXHJcbi8vcmVuZGVyIG9ubHkgaWYgZXZlcnl0aGluZyB3b3JrZWRcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==