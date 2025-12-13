// components/data/pgData.js

import pgJson from "./pgDummy.json";
import { PgProperty } from "../models/PgProperty";

export const pgList = pgJson.map((item) => new PgProperty(item));
