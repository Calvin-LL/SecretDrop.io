import * as UIHelpers from "@/UIHelpers";
import delay from "delay";

describe("animateAddTextInElement", () => {
  const testString =
    "!#$%&()*MNOPQRSTUVWXYZ[]^_`abcdefghijklmnz{|}~☇☈☉☊☋☌☍☎☏☐☑☒☓☚☛☜☝☞☟☠☡☢☣☤☥买乱乲乳乴乵乶乷乸乹乺乻乼乽癩羅蘿螺裸邏樂洛烙珞落酪駱亂👩🏼‍🦯👩‍❤️‍👨👩‍❤️‍👩👨‍❤️‍👨👩‍❤️‍💋‍👨👩‍❤️‍💋‍👩👨‍👩‍👦👨‍❤️‍💋‍👨👨‍👩‍👧👩‍👩‍👧‍👧👩‍👦👗👮🏿‍♀️👮🏿👮🏽‍♂️";

  test("empty initial string, 500ms", async () => {
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateAddTextInElement(
      "",
      testString,
      500,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(550);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenLastCalledWith(testString);

    expect(mockOnFinish).toBeCalled();
  });

  test("500ms", async () => {
    const initialString = "a";
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateAddTextInElement(
      initialString,
      testString,
      500,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(550);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(initialString + testString);

    expect(mockOnFinish).toBeCalled();
  });

  test("3000ms", async () => {
    const initialString = "a";
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateAddTextInElement(
      initialString,
      testString,
      3000,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(3200);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(initialString + testString);

    expect(mockOnFinish).toBeCalled();
  });
});

describe("animateTextTransition", () => {
  const testString =
    "!#$%&()*MNOPQRSTUVWXYZ[]^_`abcdefghijklmnz{|}~☇☈☉☊☋☌☍☎☏☐☑☒☓☚☛☜☝☞☟☠☡☢☣☤☥买乱乲乳乴乵乶乷乸乹乺乻乼乽癩羅蘿螺裸邏樂洛烙珞落酪駱亂👩🏼‍🦯👩‍❤️‍👨👩‍❤️‍👩👨‍❤️‍👨👩‍❤️‍💋‍👨👩‍❤️‍💋‍👩👨‍👩‍👦👨‍❤️‍💋‍👨👨‍👩‍👧👩‍👩‍👧‍👧👩‍👦👗👮🏿‍♀️👮🏿👮🏽‍♂️";
  const testStringScrambled =
    "QRSTU洛烙珞落酪駱亂👩🏼‍🦯👩‍❤️‍👨👩‍❤️‍👩👨‍❤️‍👨👩‍❤️‍💋‍👨👩‍❤️‍💋‍👩Vefghijklmn!#$%&()*MNOPz{|}~☇☈☉☊☋☌☍☎☏☐☑☒☓☚☛☜WXYZ[]^_`abcd☝☞☟☠☡☢☣☤☥买乱乲乳乴乵乶乷乸乹乺乻乼乽癩羅蘿螺裸邏樂👨‍👩‍👦👨‍❤️‍💋‍👨👨‍👩‍👧👩‍👩‍👧‍👧👩‍👦👗👮🏿‍♀️👮🏿👮🏽‍♂️";

  test("empty initial string, 500ms", async () => {
    const initialString = "";
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateTextTransition(
      initialString,
      testString,
      500,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(550);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(testString);

    expect(mockOnFinish).toBeCalled();
  });

  test("initial length < final length, 500ms", async () => {
    const initialString = "a";
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateTextTransition(
      initialString,
      testString,
      500,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(550);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(testString);

    expect(mockOnFinish).toBeCalled();
  });

  test("initial length < final length, 3000ms", async () => {
    const initialString = "a";
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateTextTransition(
      initialString,
      testString,
      3000,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(3200);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(testString);

    expect(mockOnFinish).toBeCalled();
  });

  test("initial length === final length, 500ms", async () => {
    const initialString = testStringScrambled;
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateTextTransition(
      initialString,
      testString,
      500,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(550);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(testString);

    expect(mockOnFinish).toBeCalled();
  });

  test("initial length === final length, 3000ms", async () => {
    const initialString = testStringScrambled;
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateTextTransition(
      initialString,
      testString,
      3000,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(3200);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(testString);

    expect(mockOnFinish).toBeCalled();
  });

  test("initial length > final length, 500ms", async () => {
    const initialString = testStringScrambled + "a";
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateTextTransition(
      initialString,
      testString,
      500,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(550);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(testString);

    expect(mockOnFinish).toBeCalled();
  });

  test("initial length > final length, 3000ms", async () => {
    const initialString = testStringScrambled + "asuouiweoiiuhjlaslu";
    const mockOnUpdate = jest.fn();
    const mockOnFinish = jest.fn();

    UIHelpers.animateTextTransition(
      initialString,
      testString,
      3000,
      mockOnUpdate,
      mockOnFinish
    );

    await delay(3200);

    expect(mockOnUpdate).toBeCalled();
    expect(mockOnUpdate).toHaveBeenNthCalledWith(1, initialString);
    expect(mockOnUpdate).toHaveBeenLastCalledWith(testString);

    expect(mockOnFinish).toBeCalled();
  });
});

describe("fillElementWithRandomText", () => {
  test("10 characters long", async () => {
    const mockOnUpdate = jest.fn();

    const stop = UIHelpers.fillElementWithRandomText(10, mockOnUpdate);

    await delay(1000);

    stop();

    expect(mockOnUpdate).toBeCalled();

    mockOnUpdate.mock.calls.forEach(([randomString]) => {
      expect((randomString as string).length).toBe(10);
    });
  });
});

describe("fillStringWithRandom", () => {
  test("20 characters long", () => {
    const prefixString = "werguhxci";
    const totalLength = 20;
    const result = UIHelpers.fillStringWithRandom(prefixString, totalLength);

    expect(result.length).toBe(totalLength);
    expect(result.startsWith(prefixString)).toBe(true);
  });
});

describe("getRandomStringOfLength", () => {
  test("20 characters long", () => {
    const length = 20;
    const result = UIHelpers.getRandomStringOfLength(length);

    expect(result.length).toBe(length);
  });
});
