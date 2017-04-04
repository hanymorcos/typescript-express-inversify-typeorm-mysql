"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents functionality to provide a new query runners, and release old ones.
 * Also can provide always same query runner.
 */
var QueryRunnerProvider = (function () {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    function QueryRunnerProvider(driver, useSingleQueryRunner) {
        if (useSingleQueryRunner === void 0) { useSingleQueryRunner = false; }
        this.driver = driver;
        this.useSingleQueryRunner = useSingleQueryRunner;
    }
    Object.defineProperty(QueryRunnerProvider.prototype, "isReleased", {
        // -------------------------------------------------------------------------
        // Accessors
        // -------------------------------------------------------------------------
        get: function () {
            return this._isReleased;
        },
        enumerable: true,
        configurable: true
    });
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Provides a new query runner used to run repository queries.
     * If use useSingleQueryRunner mode is enabled then reusable query runner will be provided instead.
     */
    QueryRunnerProvider.prototype.provide = function () {
        var _this = this;
        if (this.useSingleQueryRunner) {
            if (!this.reusableQueryRunner) {
                if (!this.reusableQueryRunnerPromise) {
                    // we do this because this method can be created multiple times
                    // this will lead to multiple query runner creations
                    this.reusableQueryRunnerPromise = this.driver
                        .createQueryRunner()
                        .then(function (reusableQueryRunner) {
                        _this.reusableQueryRunner = reusableQueryRunner;
                        return reusableQueryRunner;
                    });
                }
                return this.reusableQueryRunnerPromise;
            }
            return Promise.resolve(this.reusableQueryRunner);
        }
        return this.driver.createQueryRunner();
    };
    /**
     * Query runner release logic extracted into separated methods intently,
     * to make possible to create a subclass with its own release query runner logic.
     * Note: release only query runners that provided by a provide() method.
     * This is important and by design.
     */
    QueryRunnerProvider.prototype.release = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (queryRunner === this.reusableQueryRunner)
                    return [2 /*return*/];
                return [2 /*return*/, queryRunner.release()];
            });
        });
    };
    /**
     * Releases reused query runner.
     */
    QueryRunnerProvider.prototype.releaseReused = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._isReleased = true;
                if (this.reusableQueryRunner)
                    return [2 /*return*/, this.reusableQueryRunner.release()];
                return [2 /*return*/];
            });
        });
    };
    return QueryRunnerProvider;
}());
exports.QueryRunnerProvider = QueryRunnerProvider;

//# sourceMappingURL=QueryRunnerProvider.js.map
