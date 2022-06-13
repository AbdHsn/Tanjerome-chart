USE [master]
GO
CREATE DATABASE [PatientChartGeneratorDB]
GO
CREATE TABLE [dbo].[PatientRecords](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NULL,
	[Phone] [nvarchar](25) NULL,
	[DateOfBirth] [date] NULL,
	[Dioptres] [decimal](8, 2) NULL,
	[InsertDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[PatientRecords] ON 

INSERT [dbo].[PatientRecords] ([Id], [Name], [Phone], [DateOfBirth], [Dioptres], [InsertDate]) VALUES (1, N'Dina Begum', N'1767439445', CAST(N'2001-08-28' AS Date), CAST(2.00 AS Decimal(8, 2)), NULL)
INSERT [dbo].[PatientRecords] ([Id], [Name], [Phone], [DateOfBirth], [Dioptres], [InsertDate]) VALUES (2, N'Abdullah Bin Hasan', N'1301237713', CAST(N'1991-08-03' AS Date), CAST(4.50 AS Decimal(8, 2)), NULL)
SET IDENTITY_INSERT [dbo].[PatientRecords] OFF
GO
USE [master]
GO
ALTER DATABASE [PatientChartGeneratorDB] SET  READ_WRITE 
GO
