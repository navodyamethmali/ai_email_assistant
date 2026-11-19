import { useState, useMemo, useEffect, useCallback } from "react";
import "./App.css";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import {
  AppLogo,
  SendIcon,
  CopyIcon,
  CheckIcon,
  SunIcon,
  MoonIcon,
  ClearIcon,
  PasteIcon,
  MailIcon,
  BriefcaseIcon,
  CoffeeIcon,
  SmileIcon,
  MessageSquareIcon,
  SparklesIcon,
} from "./components/Icons";

// Curated tones with human-friendly descriptions
const TONE_OPTIONS = [
  {
    value: "",
    label: "Natural",
    desc: "Balanced & direct",
    icon: MessageSquareIcon,
  },
  {
    value: "professional",
    label: "Professional",
    desc: "Polished & formal",
    icon: BriefcaseIcon,
  },
  {
    value: "casual",
    label: "Casual",
    desc: "Warm & conversational",
    icon: CoffeeIcon,
  },
  {
    value: "friendly",
    label: "Friendly",
    desc: "Approachable & kind",
    icon: SmileIcon,
  },
];

const SAMPLE_EMAIL = `Hi Alex,

Could you please provide an update on the Q3 project deliverables? 
The team needs the final review by tomorrow afternoon to prepare for the stakeholder meeting.

Best regards,
Sarah`;

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generateReply, setGenerateReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Feedback states
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Theme mode toggle with local storage persistence
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("app-theme-mode") || "light";
  });

  const toggleTheme = () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    localStorage.setItem("app-theme-mode", nextMode);
  };

  // Modern, human-crafted theme with refined typography and natural elevation
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#0b0f19",
                  paper: "#111827",
                },
                primary: {
                  main: "#3b82f6",
                  light: "#60a5fa",
                  dark: "#2563eb",
                },
                text: {
                  primary: "#f9fafb",
                  secondary: "#9ca3af",
                },
                divider: "#1f2937",
              }
            : {
                background: {
                  default: "#f8fafc",
                  paper: "#ffffff",
                },
                primary: {
                  main: "#2563eb",
                  light: "#3b82f6",
                  dark: "#1d4ed8",
                },
                text: {
                  primary: "#0f172a",
                  secondary: "#64748b",
                },
                divider: "#e2e8f0",
              }),
        },
        typography: {
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          h5: {
            fontWeight: 700,
            letterSpacing: "-0.02em",
          },
          h6: {
            fontWeight: 600,
            letterSpacing: "-0.01em",
          },
          button: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: "0.01em",
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 10,
              },
            },
          },
        },
      }),
    [mode]
  );

  // Exact preserved backend integration logic
  const handleSubmit = useCallback(async () => {
    if (!emailContent.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
      });
      setGenerateReply(
        typeof response.data === "string" ? response.data : JSON.stringify(response.data)
      );
    } catch (err) {
      setError("Failed to generate email reply. Please verify the backend service and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [emailContent, tone]);

  // Keyboard shortcut: Ctrl + Enter / Cmd + Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (emailContent.trim() && !loading) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [emailContent, loading, handleSubmit]);

  // Copy handler with visual feedback
  const handleCopy = () => {
    if (!generateReply) return;
    navigator.clipboard.writeText(generateReply);
    setCopied(true);
    setSnackbarOpen(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Paste handler
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setEmailContent(text);
    } catch {
      // Handle blocked permissions gracefully
    }
  };

  // Word count & reading metrics helper
  const wordCount = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const isDarkMode = mode === "dark";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        className={`app-container theme-transition ${
          isDarkMode ? "ambient-glow-dark" : "ambient-glow-light"
        }`}
      >
        {/* Modern Header Navigation */}
        <Box
          component="header"
          sx={{
            py: 2,
            px: { xs: 2, sm: 3, md: 4 },
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: isDarkMode ? "rgba(17, 24, 39, 0.75)" : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Container
            maxWidth="md"
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Human-crafted Brand Identity */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AppLogo sx={{ fontSize: 34 }} />
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      letterSpacing: "-0.015em",
                      color: "text.primary",
                      lineHeight: 1.2,
                    }}
                  >
                    Email Assistant
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.6,
                      px: 0.9,
                      py: 0.2,
                      borderRadius: 10,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      backgroundColor: isDarkMode ? "rgba(34, 197, 94, 0.15)" : "#dcfce7",
                      color: isDarkMode ? "#4ade80" : "#166534",
                      border: "1px solid",
                      borderColor: isDarkMode ? "rgba(34, 197, 94, 0.3)" : "#bbf7d0",
                    }}
                  >
                    <span className="status-dot-active" />
                    Ready
                  </Box>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  Smart AI reply composer
                </Typography>
              </Box>
            </Stack>

            {/* Quick Actions & Theme Switcher */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* Shortcut Hint Pill */}
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 0.8,
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  py: 0.4,
                  px: 1.2,
                  borderRadius: 1.5,
                  backgroundColor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <span>Generate:</span>
                <span className={`key-badge ${isDarkMode ? "key-badge-dark" : "key-badge-light"}`}>
                  Ctrl
                </span>
                <span>+</span>
                <span className={`key-badge ${isDarkMode ? "key-badge-dark" : "key-badge-light"}`}>
                  ↵ Enter
                </span>
              </Box>

              {/* Theme Toggle Button */}
              <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton
                  onClick={toggleTheme}
                  size="small"
                  aria-label="Toggle visual theme"
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.5)" : "#f1f5f9",
                    color: "text.primary",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "rgba(51, 65, 85, 0.8)" : "#e2e8f0",
                      transform: "scale(1.04)",
                    },
                  }}
                >
                  {isDarkMode ? (
                    <SunIcon sx={{ fontSize: 18, color: "#facc15" }} />
                  ) : (
                    <MoonIcon sx={{ fontSize: 18, color: "#334155" }} />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Container>
        </Box>

        {/* Main Work Area */}
        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 }, flex: 1 }}>
          {/* Welcome Intro Header */}
          <Box sx={{ mb: 3.5, textAlign: { xs: "left", sm: "center" } }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.45rem", sm: "1.85rem" },
                color: "text.primary",
                letterSpacing: "-0.025em",
                mb: 0.75,
              }}
            >
              Draft thoughtful email replies in seconds
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: { xs: "0.88rem", sm: "0.96rem" },
                maxWidth: 580,
                mx: { xs: 0, sm: "auto" },
                lineHeight: 1.5,
              }}
            >
              Paste the incoming message below, choose the desired tone, and let your assistant
              prepare a well-crafted response.
            </Typography>
          </Box>

          {/* Error Banner */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{
                mb: 3,
                borderRadius: 2.5,
                border: "1px solid",
                borderColor: isDarkMode ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Primary Input Card */}
          <Paper
            elevation={0}
            className="craft-card"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 3,
              border: "1px solid",
              borderColor: isDarkMode ? "rgba(255, 255, 255, 0.09)" : "#e2e8f0",
              backgroundColor: "background.paper",
              boxShadow: isDarkMode
                ? "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)"
                : "0 4px 24px -4px rgba(15, 23, 42, 0.07), 0 1px 3px rgba(15, 23, 42, 0.04)",
            }}
          >
            {/* Input Header & Utilities */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 1.5 }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <MailIcon sx={{ fontSize: 18, color: "primary.main" }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "text.primary",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Original Email
                </Typography>
              </Stack>

              {/* Utility Action Buttons */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  variant="text"
                  onClick={() => setEmailContent(SAMPLE_EMAIL)}
                  startIcon={<SparklesIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontSize: "0.78rem",
                    py: 0.3,
                    px: 1,
                    borderRadius: 1.5,
                    color: "text.secondary",
                    backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                      color: "text.primary",
                    },
                  }}
                >
                  Try Sample
                </Button>

                <Button
                  size="small"
                  variant="text"
                  startIcon={<PasteIcon sx={{ fontSize: 14 }} />}
                  onClick={handlePaste}
                  sx={{
                    fontSize: "0.78rem",
                    py: 0.3,
                    px: 1,
                    borderRadius: 1.5,
                    color: "text.secondary",
                    backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                      color: "text.primary",
                    },
                  }}
                >
                  Paste
                </Button>

                {emailContent && (
                  <Tooltip title="Clear email text">
                    <IconButton
                      size="small"
                      onClick={() => setEmailContent("")}
                      sx={{
                        color: "text.secondary",
                        p: 0.6,
                        "&:hover": { color: "error.main" },
                      }}
                    >
                      <ClearIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Stack>

            {/* Email Input Textarea */}
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              placeholder="Paste or write the received email message here..."
              value={emailContent || ""}
              onChange={(e) => setEmailContent(e.target.value)}
              className="custom-textarea"
              sx={{
                mb: 1.25,
                "& .MuiOutlinedInput-root": {
                  fontSize: "0.93rem",
                  lineHeight: 1.65,
                  backgroundColor: isDarkMode ? "rgba(15, 23, 42, 0.4)" : "#fafafa",
                  borderColor: "divider",
                  "&:hover fieldset": {
                    borderColor: isDarkMode ? "#475569" : "#cbd5e1",
                  },
                },
              }}
            />

            {/* Real-time Metrics & Shortcuts */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.76rem" }}>
                  <strong>{wordCount(emailContent)}</strong> words • {emailContent.length} characters
                </Typography>
                {emailContent.trim() && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.76rem",
                      display: { xs: "none", sm: "inline" },
                    }}
                  >
                    • ~{Math.max(1, Math.ceil(wordCount(emailContent) / 180))} min read
                  </Typography>
                )}
              </Stack>

              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.74rem",
                  display: { xs: "none", sm: "inline" },
                }}
              >
                Press <span className={`key-badge ${isDarkMode ? "key-badge-dark" : "key-badge-light"}`}>Ctrl</span> + <span className={`key-badge ${isDarkMode ? "key-badge-dark" : "key-badge-light"}`}>Enter</span>
              </Typography>
            </Stack>

            {/* Human-Curated Tone Selector */}
            <Box sx={{ mb: 3.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.5 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    color: "text.primary",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Select Reply Tone
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                  Tailors wording and warmth
                </Typography>
              </Stack>

              {/* Interactive Tone Cards */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(4, 1fr)",
                  },
                  gap: 1.25,
                  mb: 2,
                }}
              >
                {TONE_OPTIONS.map((item) => {
                  const isSelected = tone === item.value;
                  const IconComponent = item.icon;
                  return (
                    <Box
                      key={item.value || "default"}
                      onClick={() => setTone(item.value)}
                      className="tone-card"
                      sx={{
                        p: 1.6,
                        borderRadius: 2.5,
                        border: "1.5px solid",
                        borderColor: isSelected
                          ? "primary.main"
                          : isDarkMode
                          ? "#1f2937"
                          : "#e2e8f0",
                        backgroundColor: isSelected
                          ? isDarkMode
                            ? "rgba(59, 130, 246, 0.12)"
                            : "rgba(37, 99, 235, 0.05)"
                          : isDarkMode
                          ? "rgba(17, 24, 39, 0.6)"
                          : "#ffffff",
                        boxShadow: isSelected
                          ? isDarkMode
                            ? "0 0 0 1px rgba(59, 130, 246, 0.4)"
                            : "0 0 0 1px rgba(37, 99, 235, 0.25)"
                          : "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.6,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box
                          sx={{
                            color: isSelected ? "primary.main" : "text.secondary",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <IconComponent sx={{ fontSize: 18 }} />
                        </Box>
                        {isSelected && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "primary.main",
                            }}
                          />
                        )}
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isSelected ? 700 : 600,
                          fontSize: "0.86rem",
                          color: isSelected ? "primary.main" : "text.primary",
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.72rem",
                          lineHeight: 1.25,
                        }}
                      >
                        {item.desc}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              {/* Preserved Select Dropdown for complete parity and accessibility */}
              <Box sx={{ display: "none" }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="tone-select-label">Tone (Optional)</InputLabel>
                  <Select
                    labelId="tone-select-label"
                    value={tone || ""}
                    label="Tone (Optional)"
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="professional">Professional</MenuItem>
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="friendly">Friendly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Primary Action Button */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!emailContent.trim() || loading}
              fullWidth
              size="large"
              startIcon={!loading && <SendIcon sx={{ fontSize: 18 }} />}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: "0.96rem",
                borderRadius: 2.5,
                background:
                  !emailContent.trim() || loading
                    ? undefined
                    : isDarkMode
                    ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                    : "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: !emailContent.trim() || loading ? "none" : "translateY(-1px)",
                  boxShadow:
                    !emailContent.trim() || loading
                      ? "none"
                      : "0 6px 20px -3px rgba(37, 99, 235, 0.35)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              {loading ? (
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <CircularProgress size={18} color="inherit" thickness={4} />
                  <span>Generating thoughtful reply...</span>
                </Stack>
              ) : (
                "Generate Reply"
              )}
            </Button>
          </Paper>

          {/* Generated Reply Card (Crafted Email Preview) */}
          {generateReply && (
            <Paper
              elevation={0}
              className="craft-card fade-in-up"
              sx={{
                mt: 3.5,
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 3,
                border: "1px solid",
                borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#cbd5e1",
                backgroundColor: "background.paper",
                boxShadow: isDarkMode
                  ? "0 8px 30px -4px rgba(0, 0, 0, 0.6)"
                  : "0 8px 30px -4px rgba(15, 23, 42, 0.08)",
              }}
            >
              {/* Output Header */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1.5}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.98rem",
                        color: "text.primary",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Generated Reply
                    </Typography>
                    <Box
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        px: 0.9,
                        py: 0.15,
                        borderRadius: 1,
                        backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.15)" : "#eff6ff",
                        color: isDarkMode ? "#93c5fd" : "#1d4ed8",
                      }}
                    >
                      {tone ? tone.charAt(0).toUpperCase() + tone.slice(1) : "Natural"} Tone
                    </Box>
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.76rem" }}>
                    {wordCount(generateReply)} words • Ready to copy and send
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ alignSelf: { xs: "stretch", sm: "auto" } }}>
                  <Button
                    variant={copied ? "contained" : "outlined"}
                    color={copied ? "success" : "primary"}
                    size="small"
                    onClick={handleCopy}
                    startIcon={
                      copied ? (
                        <CheckIcon sx={{ fontSize: 16 }} />
                      ) : (
                        <CopyIcon sx={{ fontSize: 16 }} />
                      )
                    }
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      py: 0.6,
                      px: 1.5,
                      borderRadius: 2,
                      borderColor: copied ? undefined : "divider",
                      flex: { xs: 1, sm: "initial" },
                    }}
                  >
                    {copied ? "Copied!" : "Copy Reply"}
                  </Button>

                  <Button
                    size="small"
                    variant="text"
                    color="inherit"
                    onClick={() => setGenerateReply("")}
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.8rem",
                      borderRadius: 2,
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Stack>

              {/* Reply TextField */}
              <TextField
                fullWidth
                multiline
                rows={7}
                variant="outlined"
                value={generateReply || ""}
                inputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.94rem",
                    lineHeight: 1.7,
                    backgroundColor: isDarkMode ? "rgba(15, 23, 42, 0.5)" : "#f8fafc",
                    borderColor: "divider",
                  },
                }}
              />

              {/* Gentle human guidance footer */}
              <Typography
                variant="caption"
                sx={{
                  mt: 1.5,
                  display: "block",
                  color: "text.secondary",
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                }}
              >
                Tip: Feel free to customize specific details in your email client before hitting send.
              </Typography>
            </Paper>
          )}

          {/* Minimal Human-Crafted Footer */}
          <Box
            component="footer"
            sx={{
              mt: 6,
              pt: 3,
              borderTop: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
            >
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.76rem" }}>
                Email Reply Assistant • Clean & private local workflow
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.74rem" }}>
                Responses powered by local API (port 8080)
              </Typography>
            </Stack>
          </Box>
        </Container>

        {/* Copy Feedback Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2200}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            variant="filled"
            sx={{
              width: "100%",
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "0.85rem",
              boxShadow: "0 8px 24px -4px rgba(0, 0, 0, 0.2)",
            }}
          >
            Draft reply copied to clipboard!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;