import app from "./index";
import {createClient} from "@supabase/supabase-js";

require("dotenv").config();
const port = 8080;

const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_KEY || "");
app.set("supabase", supabase);

console.log(`Node environment: ${process.env.NODE_ENV}`);
app.listen(port, () => {
	console.log(`Example app listening at port http://localhost:${port}`);
});
