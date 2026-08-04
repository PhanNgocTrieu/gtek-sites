import React from "react";
import { Box, Flex, Text } from "@sanity/ui";

export default function StudioLogo() {
  return (
    <Flex align="center" gap={3} padding={3}>
      <Box
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: "linear-gradient(135deg, #0A192F 0%, #1e3a5f 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Text size={1} weight="bold" style={{ color: "#FFC107", lineHeight: 1 }}>
          G
        </Text>
      </Box>
      <Flex direction="column" gap={1}>
        <Text size={1} weight="semibold" style={{ lineHeight: 1.2 }}>
          GTek Studio
        </Text>
        <Text size={0} muted style={{ lineHeight: 1 }}>
          Website content
        </Text>
      </Flex>
    </Flex>
  );
}
