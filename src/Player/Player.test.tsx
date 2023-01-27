import React from "react";
import { render } from "@testing-library/react";

import Player from "./Player";

describe("Player", () => {
  test("renders the player component", () => {
    render(<Player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />);
  });
});
