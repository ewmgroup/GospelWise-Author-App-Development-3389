import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak, Footer, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Common formatting and branding for both export types
const BRANDING_TEXT = "Created using the GospelWise Author App | gospelwiseauthor.app";

/**
 * Export project to PDF format
 * @param {Object} project - The project data
 * @param {Object} user - The user data (for author name)
 */
export const exportToPDF = (project, user) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set default font to a serif font
  doc.setFont("times", "normal");

  // Add cover page
  doc.setFontSize(24);
  doc.text(project.title || "Untitled Project", 105, 80, { align: 'center' });
  doc.setFontSize(16);
  doc.text(`${project.type} Project`, 105, 100, { align: 'center' });
  if (user?.name) {
    doc.setFontSize(14);
    doc.text(`By ${user.name}`, 105, 120, { align: 'center' });
  }

  // Add branding on the cover page
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(BRANDING_TEXT, 105, 280, { align: 'center' });

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Add a new page to start content
  doc.addPage();

  // PDF formatting settings
  const margin = 20;
  const pageWidth = 210 - (margin * 2);
  let yPos = margin;

  // Add footer to all pages
  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(BRANDING_TEXT, 105, 287, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 195, 287, { align: 'right' });
      doc.setTextColor(0, 0, 0);
    }
  };

  // Helper to add section with title
  const addSection = (title, content, options = {}) => {
    // Check if we need a page break
    if (options.pageBreak && yPos > margin) {
      doc.addPage();
      yPos = margin;
    }

    // Add section title
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text(title, margin, yPos);
    yPos += 10;

    // Add section content
    doc.setFontSize(11);
    doc.setFont("times", "normal");
    
    if (typeof content === 'string') {
      // For simple string content
      const textLines = doc.splitTextToSize(content || "Not provided", pageWidth);
      doc.text(textLines, margin, yPos);
      yPos += (textLines.length * 6) + 10;
    } else if (typeof content === 'object') {
      // For object content (like reader persona)
      Object.entries(content).forEach(([key, value]) => {
        if (value) {
          // Add field label
          doc.setFont("times", "bold");
          doc.text(formatLabel(key) + ":", margin, yPos);
          yPos += 6;

          // Add field value
          doc.setFont("times", "normal");
          const textLines = doc.splitTextToSize(value || "Not provided", pageWidth);
          doc.text(textLines, margin, yPos);
          yPos += (textLines.length * 6) + 8;
        }
      });
    }

    // Check if we need to add a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = margin;
    }
  };

  // Format field labels
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // Export content based on project type
  if (project.type === 'nonfiction') {
    exportNonfictionToPDF(project, doc, addSection);
  } else {
    exportFictionToPDF(project, doc, addSection);
  }

  // Add footers
  addFooter();

  // Save the PDF
  doc.save(`${project.title || "Project"}_Export.pdf`);
};

/**
 * Export nonfiction project to PDF
 */
const exportNonfictionToPDF = (project, doc, addSection) => {
  // Part 1: Message Mapping
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont("times", "bold");
  doc.text("Part 1: Message Mapping - Pre-Writing Work", 20, 20);
  
  // Add Kingdom Concept section
  addSection("1. Kingdom Concept (Nonfiction \"Hook\")", project.kingdomConcept);

  // Add Reader Persona section
  if (project.readerPersona) {
    addSection("2. Your Reader (Nonfiction \"Character\")", {
      "Life Stage": project.readerPersona.lifeStage,
      "Struggle": project.readerPersona.struggle,
      "Desire": project.readerPersona.desire,
      "Objections": project.readerPersona.objections
    }, { pageBreak: true });
  }

  // Add Core Themes section
  addSection("3. Core Themes", project.coreThemes, { pageBreak: true });

  // Add Source Material section
  addSection("4. Source Material + Ideas", project.sourceMaterial, { pageBreak: true });

  // Add Holy Spirit Insights section
  addSection("5. Message Notes + Holy Spirit Insights", project.holySpirit, { pageBreak: true });

  // Part 2: StoryWise Nonfiction Structure
  if (project.nonfictionStructure) {
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text("Part 2: StoryWise™ Nonfiction Structure", 20, 20);

    const movements = [
      { key: 'startingWhereTheyAre', title: 'Movement 1: Starting Where They Are' },
      { key: 'hookingWithHope', title: 'Movement 2: Hooking with Hope' },
      { key: 'firstShift', title: 'Movement 3: The First Shift' },
      { key: 'firstWakeUpCall', title: 'Movement 4: The First Wake-Up Call' },
      { key: 'gospelCenteredReframe', title: 'Movement 5: Gospel-Centered Reframe' },
      { key: 'costOfChange', title: 'Movement 6: The Cost of Change' },
      { key: 'finalBreakthrough', title: 'Movement 7: The Final Breakthrough' },
      { key: 'livingTheChange', title: 'Movement 8: Living the Change' },
      { key: 'finalEncouragement', title: 'Movement 9: Final Encouragement' }
    ];

    movements.forEach((movement, index) => {
      if (index > 0 && index % 3 === 0) {
        addSection(movement.title, project.nonfictionStructure[movement.key], { pageBreak: true });
      } else {
        addSection(movement.title, project.nonfictionStructure[movement.key]);
      }
    });
  }
};

/**
 * Export fiction project to PDF
 */
const exportFictionToPDF = (project, doc, addSection) => {
  // Story Concept Tab
  doc.setFontSize(18);
  doc.setFont("times", "bold");
  doc.text("Story Concept", 20, 20);
  
  // Project Overview
  if (project.title || project.genre || project.targetAudience || project.wordCountGoal) {
    addSection("Project Overview", {
      "Title": project.title,
      "Genre": project.genre,
      "Target Audience": project.targetAudience,
      "Word Count Goal": project.wordCountGoal ? `${project.wordCountGoal.toLocaleString()} words` : undefined
    });
  }
  
  // One-Line Premise
  addSection("One-Line Premise", project.premise);
  
  // Story Description
  addSection("Story Description", project.description);
  
  // Central Theme
  addSection("Central Theme", project.theme);
  
  // Faith Element
  addSection("Faith Element", project.faithElement);
  
  // Key Story Arc
  if (project.storyBeginning || project.storyMiddle || project.storyEnd) {
    addSection("Key Story Arc", {
      "Beginning": project.storyBeginning,
      "Middle": project.storyMiddle,
      "End": project.storyEnd
    }, { pageBreak: true });
  }
  
  // Reader Transformation
  addSection("Reader Transformation", project.readerTransformation);

  // StoryWise Structure Tab
  if (project.storyStructure) {
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("times", "bold");
    doc.text("StoryWise Structure", 20, 20);
    
    const movements = [
      { key: 'openingScene', title: 'Movement 1: Opening Scene' },
      { key: 'hookingMoment', title: 'Movement 2: Hooking Moment' },
      { key: 'firstPlotPoint', title: 'Movement 3: First Plot Point' },
      { key: 'firstPinchPoint', title: 'Movement 4: First Pinch Point' },
      { key: 'midpointShift', title: 'Movement 5: Midpoint Shift' },
      { key: 'secondPinchPoint', title: 'Movement 6: Second Pinch Point' },
      { key: 'secondPlotPoint', title: 'Movement 7: Second Plot Point' },
      { key: 'finalResolution', title: 'Movement 8: Final Resolution' },
      { key: 'worldBackToNormal', title: 'Movement 9: World Back to Normal' }
    ];
    
    movements.forEach((movement, index) => {
      if (index > 0 && index % 3 === 0) {
        addSection(movement.title, project.storyStructure[movement.key], { pageBreak: true });
      } else {
        addSection(movement.title, project.storyStructure[movement.key]);
      }
    });
  }

  // Characters Tab
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont("times", "bold");
  doc.text("Characters", 20, 20);
  
  // Protagonist
  if (project.protagonist || project.protagonistGoals || project.protagonistFlaw) {
    addSection("Protagonist", {
      "Character Name & Background": project.protagonist,
      "Character Goals & Motivations": project.protagonistGoals,
      "Character Flaws & Growth Arc": project.protagonistFlaw
    });
  }
  
  // Antagonist
  if (project.antagonist || project.antagonistMotivations) {
    addSection("Antagonist", {
      "Antagonist Description": project.antagonist,
      "Antagonist Motivations": project.antagonistMotivations
    }, { pageBreak: true });
  }
  
  // Supporting Characters
  addSection("Supporting Characters", project.supportingCharacters);

  // Story World Tab
  doc.addPage();
  doc.setFontSize(18);
  doc.setFont("times", "bold");
  doc.text("Story World", 20, 20);
  
  // Setting & Time Period
  if (project.setting || project.timePeriod) {
    addSection("Setting & Time Period", {
      "Primary Location(s)": project.setting,
      "Time Period & Historical Context": project.timePeriod
    });
  }
  
  // World Rules
  addSection("World Rules & Logic", project.worldRules);
  
  // Central Conflict & Stakes
  if (project.conflict || project.stakes) {
    addSection("Central Conflict & Stakes", {
      "Main Conflict": project.conflict,
      "What's at Stake?": project.stakes
    }, { pageBreak: true });
  }
  
  // Spiritual Elements
  addSection("Faith & Spiritual Elements", project.spiritualElements);
};

/**
 * Export project to Word document format
 * @param {Object} project - The project data
 * @param {Object} user - The user data (for author name)
 */
export const exportToWord = (project, user) => {
  // Create a new document
  const doc = new Document({
    creator: user?.name || "GospelWise Author",
    title: project.title || "Untitled Project",
    description: `${project.type} project export from GospelWise Author App`,
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24,
            font: "Calibri",
          },
          paragraph: {
            spacing: {
              after: 200,
            },
          },
        },
      ],
    },
  });

  // Create document sections
  const children = [];

  // Add cover page
  children.push(
    new Paragraph({
      text: project.title || "Untitled Project",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  children.push(
    new Paragraph({
      text: `${project.type} Project`,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  if (user?.name) {
    children.push(
      new Paragraph({
        text: `By ${user.name}`,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
      })
    );
  }

  // Add page break after cover
  children.push(new Paragraph({ text: "", pageBreak: true }));

  // Helper function to add a section with title
  const addSection = (title, content, options = {}) => {
    // Add section title
    children.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      })
    );

    // Add section content
    if (typeof content === 'string' && content) {
      // For simple string content
      children.push(
        new Paragraph({
          text: content || "Not provided",
          spacing: { after: 300 },
        })
      );
    } else if (typeof content === 'object') {
      // For object content (like reader persona)
      Object.entries(content).forEach(([key, value]) => {
        if (value) {
          // Add field label
          children.push(
            new Paragraph({
              text: formatLabel(key) + ":",
              heading: HeadingLevel.HEADING_3,
              spacing: { after: 100 },
            })
          );

          // Add field value
          children.push(
            new Paragraph({
              text: value || "Not provided",
              spacing: { after: 300 },
            })
          );
        }
      });
    }

    // Add page break if specified
    if (options.pageBreak) {
      children.push(new Paragraph({ text: "", pageBreak: true }));
    }
  };

  // Format field labels
  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // Add content based on project type
  if (project.type === 'nonfiction') {
    addNonfictionToWord(project, children, addSection);
  } else {
    addFictionToWord(project, children, addSection);
  }

  // Add all children to the document
  doc.addSection({
    children: children,
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            text: BRANDING_TEXT,
            alignment: AlignmentType.CENTER,
            style: {
              size: 8,
              color: "888888",
            },
          }),
        ],
      }),
    },
  });

  // Generate the document
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${project.title || "Project"}_Export.docx`);
  }).catch(error => {
    console.error("Error generating Word document:", error);
    alert("There was an error generating your Word document. Please try again or use PDF export instead.");
  });
};

/**
 * Add nonfiction content to Word document
 */
const addNonfictionToWord = (project, children, addSection) => {
  // Part 1: Message Mapping
  children.push(
    new Paragraph({
      text: "Part 1: Message Mapping - Pre-Writing Work",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    })
  );

  // Add Kingdom Concept section
  addSection("1. Kingdom Concept (Nonfiction \"Hook\")", project.kingdomConcept);

  // Add Reader Persona section
  if (project.readerPersona) {
    addSection("2. Your Reader (Nonfiction \"Character\")", {
      "Life Stage": project.readerPersona.lifeStage,
      "Struggle": project.readerPersona.struggle,
      "Desire": project.readerPersona.desire,
      "Objections": project.readerPersona.objections
    });
  }

  // Add Core Themes section
  addSection("3. Core Themes", project.coreThemes);

  // Add Source Material section
  addSection("4. Source Material + Ideas", project.sourceMaterial);

  // Add Holy Spirit Insights section
  addSection("5. Message Notes + Holy Spirit Insights", project.holySpirit, { pageBreak: true });

  // Part 2: StoryWise Nonfiction Structure
  if (project.nonfictionStructure) {
    children.push(
      new Paragraph({
        text: "Part 2: StoryWise™ Nonfiction Structure",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
      })
    );

    const movements = [
      { key: 'startingWhereTheyAre', title: 'Movement 1: Starting Where They Are' },
      { key: 'hookingWithHope', title: 'Movement 2: Hooking with Hope' },
      { key: 'firstShift', title: 'Movement 3: The First Shift' },
      { key: 'firstWakeUpCall', title: 'Movement 4: The First Wake-Up Call' },
      { key: 'gospelCenteredReframe', title: 'Movement 5: Gospel-Centered Reframe' },
      { key: 'costOfChange', title: 'Movement 6: The Cost of Change' },
      { key: 'finalBreakthrough', title: 'Movement 7: The Final Breakthrough' },
      { key: 'livingTheChange', title: 'Movement 8: Living the Change' },
      { key: 'finalEncouragement', title: 'Movement 9: Final Encouragement' }
    ];

    movements.forEach((movement, index) => {
      addSection(movement.title, project.nonfictionStructure[movement.key]);
      if (index < movements.length - 1 && (index + 1) % 3 === 0) {
        children.push(new Paragraph({ text: "", pageBreak: true }));
      }
    });
  }
};

/**
 * Add fiction content to Word document
 */
const addFictionToWord = (project, children, addSection) => {
  // Story Concept Section
  children.push(
    new Paragraph({
      text: "Story Concept",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    })
  );

  // Project Overview
  if (project.title || project.genre || project.targetAudience || project.wordCountGoal) {
    addSection("Project Overview", {
      "Title": project.title,
      "Genre": project.genre,
      "Target Audience": project.targetAudience,
      "Word Count Goal": project.wordCountGoal ? `${project.wordCountGoal.toLocaleString()} words` : undefined
    });
  }
  
  // One-Line Premise
  addSection("One-Line Premise", project.premise);
  
  // Story Description
  addSection("Story Description", project.description);
  
  // Central Theme
  addSection("Central Theme", project.theme);
  
  // Faith Element
  addSection("Faith Element", project.faithElement);
  
  // Key Story Arc
  if (project.storyBeginning || project.storyMiddle || project.storyEnd) {
    addSection("Key Story Arc", {
      "Beginning": project.storyBeginning,
      "Middle": project.storyMiddle,
      "End": project.storyEnd
    });
  }
  
  // Reader Transformation
  addSection("Reader Transformation", project.readerTransformation, { pageBreak: true });

  // StoryWise Structure
  if (project.storyStructure) {
    children.push(
      new Paragraph({
        text: "StoryWise Structure",
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 },
      })
    );
    
    const movements = [
      { key: 'openingScene', title: 'Movement 1: Opening Scene' },
      { key: 'hookingMoment', title: 'Movement 2: Hooking Moment' },
      { key: 'firstPlotPoint', title: 'Movement 3: First Plot Point' },
      { key: 'firstPinchPoint', title: 'Movement 4: First Pinch Point' },
      { key: 'midpointShift', title: 'Movement 5: Midpoint Shift' },
      { key: 'secondPinchPoint', title: 'Movement 6: Second Pinch Point' },
      { key: 'secondPlotPoint', title: 'Movement 7: Second Plot Point' },
      { key: 'finalResolution', title: 'Movement 8: Final Resolution' },
      { key: 'worldBackToNormal', title: 'Movement 9: World Back to Normal' }
    ];
    
    movements.forEach((movement, index) => {
      addSection(movement.title, project.storyStructure[movement.key]);
      if (index < movements.length - 1 && (index + 1) % 3 === 0) {
        children.push(new Paragraph({ text: "", pageBreak: true }));
      }
    });
  }

  // Characters Section
  children.push(
    new Paragraph({
      text: "Characters",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
      pageBreak: true
    })
  );
  
  // Protagonist
  if (project.protagonist || project.protagonistGoals || project.protagonistFlaw) {
    addSection("Protagonist", {
      "Character Name & Background": project.protagonist,
      "Character Goals & Motivations": project.protagonistGoals,
      "Character Flaws & Growth Arc": project.protagonistFlaw
    });
  }
  
  // Antagonist
  if (project.antagonist || project.antagonistMotivations) {
    addSection("Antagonist", {
      "Antagonist Description": project.antagonist,
      "Antagonist Motivations": project.antagonistMotivations
    });
  }
  
  // Supporting Characters
  addSection("Supporting Characters", project.supportingCharacters, { pageBreak: true });

  // Story World Section
  children.push(
    new Paragraph({
      text: "Story World",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    })
  );
  
  // Setting & Time Period
  if (project.setting || project.timePeriod) {
    addSection("Setting & Time Period", {
      "Primary Location(s)": project.setting,
      "Time Period & Historical Context": project.timePeriod
    });
  }
  
  // World Rules
  addSection("World Rules & Logic", project.worldRules);
  
  // Central Conflict & Stakes
  if (project.conflict || project.stakes) {
    addSection("Central Conflict & Stakes", {
      "Main Conflict": project.conflict,
      "What's at Stake?": project.stakes
    });
  }
  
  // Spiritual Elements
  addSection("Faith & Spiritual Elements", project.spiritualElements);
};