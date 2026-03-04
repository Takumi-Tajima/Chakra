import { useRef } from "react"
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react"

export const RefDemo = () => {
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>ref デモ：スクロール移動</Heading>

      <Text mb={4}>
        ボタンを押すと、ref で掴んだ要素までスクロールするで。
      </Text>

      {/* ボタン群 */}
      <Flex gap={4} mb={8} position="sticky" top={0} bg="gray.100" py={4} zIndex={1}>
        <Button colorPalette="teal" onClick={() => scrollTo(section1Ref)}>
          セクション1へ
        </Button>
        <Button colorPalette="blue" onClick={() => scrollTo(section2Ref)}>
          セクション2へ
        </Button>
        <Button colorPalette="purple" onClick={() => scrollTo(section3Ref)}>
          セクション3へ
        </Button>
      </Flex>

      {/* セクション1 */}
      <Box ref={section1Ref} bg="teal.100" p={8} mb={4} borderRadius="md" minH="80vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <Heading size="xl" color="teal.700">セクション1</Heading>
          <Text mt={4} color="teal.600">
            ref=&#123;section1Ref&#125; でこの要素を掴んでる。
          </Text>
          <Text color="teal.600">
            ボタンを押すと scrollIntoView() で飛んでくる。
          </Text>
        </Box>
      </Box>

      {/* セクション2 */}
      <Box ref={section2Ref} bg="blue.100" p={8} mb={4} borderRadius="md" minH="80vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <Heading size="xl" color="blue.700">セクション2</Heading>
          <Text mt={4} color="blue.600">
            ref=&#123;section2Ref&#125; でこの要素を掴んでる。
          </Text>
          <Text color="blue.600">
            ref がないと、React からこの要素に直接アクセスできひん。
          </Text>
        </Box>
      </Box>

      {/* セクション3 */}
      <Box ref={section3Ref} bg="purple.100" p={8} mb={4} borderRadius="md" minH="80vh" display="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <Heading size="xl" color="purple.700">セクション3</Heading>
          <Text mt={4} color="purple.600">
            ref=&#123;section3Ref&#125; でこの要素を掴んでる。
          </Text>
          <Text color="purple.600">
            ref は DOM を直接操作したいときだけ使うもんやで。
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
