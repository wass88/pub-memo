import glob from "glob";
import path from "path";

function globImport(pat: string) {
  return new Promise((ok, ng) => {
    const dir = path.resolve(__dirname, "../../../");
    console.error("DIR", dir, pat);
    glob(path.join(dir, pat), function (err, res) {
      if (err) {
        ng(err);
      } else {
        console.error(res, dir);
        const modules = Promise.all(
          res.map((file) => {
            return import(
              file.replace(dir, "../../../../../../").replace(/.[^.]+$/, "")
            );
          })
        );
        modules.then(ok, ng);
      }
    });
  });
}

export async function importMemos() {
  return globImport("memo/*.tsx");
}
