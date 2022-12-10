var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var fs = require('fs');
var merge = require('easy-pdf-merge');
/**
 * Start with a file
 *   - Find all the children
 *   - create an array of all the files names
 *   - merge and output to the output folder
 *
 *   Loop through all elements
 *
 *    Find prefix
 *      if prefix exists, add the whole string to map array - sorted by the page number
 *
 *      <string, {
 *          prefix: string,
 *          // sorted by page number
 *          children: string[]
 *      }>
 *
 *      if doesnt exist, add to map
 *
 *
 */
function combinePDFs() {
    return __awaiter(this, void 0, void 0, function () {
        var inputDir, pdfDirArr, pdfDirSet, groupingMap, prefixes;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputDir = './pdfs';
                    pdfDirArr = fs.readdirSync(inputDir);
                    pdfDirSet = new Set(pdfDirArr);
                    groupingMap = new Map();
                    // Group all files into their date prefixes.
                    // This will result in prefixes grouped into a map of keys by array index
                    pdfDirArr.forEach(function (fileName) {
                        var prefix = fileName.split('-')[0];
                        var pageNumber = fileName.split('-')[1].split('.')[0];
                        var existingPrefix = groupingMap.get(prefix);
                        if (existingPrefix) {
                            existingPrefix.set(parseInt(pageNumber), fileName);
                        }
                        else {
                            var childMap = new Map();
                            childMap.set(parseInt(pageNumber), fileName);
                            groupingMap.set(prefix, childMap);
                        }
                    });
                    prefixes = Array.from(groupingMap.keys());
                    return [4 /*yield*/, Promise.all(prefixes.map(function (prefix) { return __awaiter(_this, void 0, void 0, function () {
                            var children, currentConcatArray, numberOfChildren, i, child, isChild, pdfsToMerge, pdfsToMerge;
                            return __generator(this, function (_a) {
                                children = groupingMap.get(prefix);
                                currentConcatArray = [];
                                if (children) {
                                    numberOfChildren = Array.from(children.keys()).length;
                                    for (i = 1; i <= numberOfChildren; i++) {
                                        child = children.get(i);
                                        if (child) {
                                            isChild = child.endsWith('-c.pdf');
                                            if (isChild) {
                                                // add to array if child
                                                currentConcatArray.push(child);
                                            }
                                            else {
                                                if (currentConcatArray.length > 0) {
                                                    // if new parent is found, output the current array to a pdf
                                                    // and reset the array, and the push the parent
                                                    if (currentConcatArray.length > 1) {
                                                        pdfsToMerge = __spreadArray([], currentConcatArray.map(function (fileName) { return "".concat(inputDir, "/").concat(fileName); }), true);
                                                        merge(pdfsToMerge, "./output_pdfs/".concat(currentConcatArray[0]), function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        fs.copyFileSync("".concat(inputDir, "/").concat(currentConcatArray[0]), "./output_pdfs/".concat(currentConcatArray[0]));
                                                    }
                                                }
                                                currentConcatArray.length = 0;
                                                currentConcatArray.push(child);
                                            }
                                        }
                                    }
                                    // handle last parent here
                                    // Should refacrtor into a function
                                    if (currentConcatArray.length > 0) {
                                        // if new parent is found, output the current array to a pdf
                                        // and reset the array, and the push the parent
                                        if (currentConcatArray.length > 1) {
                                            pdfsToMerge = __spreadArray([], currentConcatArray.map(function (fileName) { return "".concat(inputDir, "/").concat(fileName); }), true);
                                            merge(pdfsToMerge, "./output_pdfs/".concat(currentConcatArray[0]), function (err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                        }
                                        else {
                                            fs.copyFileSync("".concat(inputDir, "/").concat(currentConcatArray[0]), "./output_pdfs/".concat(currentConcatArray[0]));
                                        }
                                    }
                                }
                                return [2 /*return*/];
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
combinePDFs();
