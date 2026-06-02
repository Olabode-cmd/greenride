/*
 * Base bottom sheet wrapper around @gorhom/bottom-sheet.
 * Provides a consistent handle, backdrop, and surface colour
 * for all modal sheets in the app.
 *
 * Usage: hold a ref, call ref.current?.present() / .dismiss().
 */
import { useTheme } from "@/theme/use-theme";
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { StyleSheet } from "react-native";

interface BottomSheetProps {
  snapPoints?: (string | number)[];
  children: React.ReactNode;
  enableDynamicSizing?: boolean;
}

export const Sheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  function Sheet({ snapPoints, children, enableDynamicSizing = true }, ref) {
    const { colors } = useTheme();

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 36 }}
        backgroundStyle={{ backgroundColor: colors.surface }}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.content}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
});
