import buttons from "./buttons.json";
import titles from "./titles.json";
import errors from "./errors.json";
import { LangTitles } from "../src/interface";
import { Lang } from "../src/enums";

class Titles {
  private dictionary: LangTitles = {};

  constructor() {
    this.dictionary = { ...titles, ...buttons, ...errors };
  }

  /**
   * Get text from Titles by language
   * @param key - Key in Titles
   * @param language - Language key as keyof Lang enum
   * @param insertions - Optional array with insertion strings or Title`s key
   * @returns - string what contain Title and all insertions
   */
  public getText(
    key: string | Array<string>,
    language: Lang,
    insertions: Array<string> = []
  ): string {
    //Make defaile empty value
    let value = "";
    //If key is array
    if (Array.isArray(key)) {
      //For each keys
      key.forEach((item) => {
        //Merge or string from distionary or key as string
        value += (this.dictionary[item][language] || item) + " ";
      });
    }
    //If key is string
    else {
      //Get or string from dictionary or use key as string
      value = this.dictionary[key]
        ? this.dictionary[key][language] || key
        : key;
    }
    //If insertions presen return string with replaced insertions or just string
    return insertions.length ? this.insert(value, insertions, language) : value;
  }

  /**
   * Replace '*' in text by insertions or Titles
   * @param str - base string
   * @param insertions - Array with insertion strings or Title`s key
   * @param language - Language key as keyof Lang enum
   * @returns
   */
  insert(str: string, insertions: Array<string>, language: Lang): string {
    //Make
    let new_string: string = "";
    for (const insertion of insertions) {
      const text = this.getText(insertion, language) || insertion;
      new_string = (new_string || str).replace("*", text);
    }
    return new_string;
  }

  /**
   * Check if text match Titles by key
   * @param key - Key in Titles
   * @param text - text to match
   * @returns - true if text present in Titles by key
   */
  isInValue(key: string, text: string): boolean {
    const value = this.dictionary[key];
    if (typeof value === "string") return text === value;
    if (typeof value === "object")
      return Object.values(value).some((value) => text === value);
    return false;
  }

  /**
   * Function to check text in titles by Telegraf
   * @param key - Key in Titles
   * @returns - callback function
   */
  hearsTrigger(key: string) {
    return Object.values(this.dictionary[key]);
  }
}

export default new Titles();
